// 观己实验室 · Agent 3（人生模拟）后端
// 职责：
//   1. 进入模拟页时，从存储读取「三个原型 + 测试答案 + 资源数据 + 最近3条历史输入 + user_ideal_scenario」并拼入上下文；
//   2. 生成原型专属模拟场景（含后台防御机制映射，不返回前端）；
//   3. 用户完成选择后生成个性化解读（引用防御机制）；
//   4. 用户提交理想结局，写入 user_ideal_scenario 并刷新 lastSelfCheckUpdate。
//
// 路由：
//   GET  /api/simulate?action=state
//   POST /api/simulate  { action: 'save-prototypes' | 'scenario' | 'interpret' | 'ideal' }
//
// 【信任边界】本文件不再信任前端传入的 userId / email。
//   用户身份一律来自会话：server.js 解析 Cookie 得到 token，
//   这里通过 getCurrentUser 查 sessions 表校验有效性并取出用户 UUID。
//   未登录或会话过期一律返回 401，前端无法通过伪造 userId 读写他人数据。

import { AGENT_SIMULATOR, SIMULATE_PHASE_SCENARIO, SIMULATE_PHASE_INTERPRET } from '../prompts/agentSimulator.js';
import { buildUserContext, buildCoreProfileBlock, buildAgentUserMessage } from '../userContextBuilder.js';
import { callModel } from '../lib/modelClient.js';
import { classifyStyle } from '../lib/styleClassifier.js';
import { getCurrentUser } from './auth.js';
import {
  savePrototypes, saveDefenseMap, getDefenseMap,
  appendAgent3History, getAgent3History,
  saveIdealScenario, getUserRecord
} from '../lib/userStore.js';

const ALLOWED_ORIGINS = {
  'http://162.14.105.122:8787': true,
  'http://localhost:8787': true,
  'http://localhost:8777': true,
  'http://127.0.0.1:8777': true,
  'null': true
};

function jsonErr(res, code, message, status) {
  res.status(status || 400).json({ error: { code, message } });
}

function parseBody(raw) {
  return typeof raw === 'string' ? JSON.parse(raw || '{}') : (raw || {});
}

// 从模型返回中提取 JSON（容忍代码块围栏与前后解释文字）
function extractJson(text) {
  let t = String(text || '').trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start > -1 && end > start) t = t.slice(start, end + 1);
  try { return JSON.parse(t); } catch (e) { return null; }
}

// 组装 Agent 3 的上下文数据（对应需求二）
async function assembleAgent3Context(userId, body) {
  const rec = await getUserRecord(userId);
  const injectedContext = buildUserContext({
    profile: body.profile,
    history: body.history,
    recentInputs: body.recentInputs,
    growth: body.growth,
    designSnapshot: body.designSnapshot,
    extra: body.extra
  });
  const coreProfile = await buildCoreProfileBlock(injectedContext);
  return {
    rec,
    injectedContext,
    coreProfileText: coreProfile.text,
    prototypesRaw: (rec.prototypes && rec.prototypes.raw) || '',
    idealScenario: rec.idealScenario || '',
    agent3History: await getAgent3History(userId, 3)
  };
}

// 把「原型 + 测试答案 + 资源 + 历史原话 + 理想结局」写成结构化上下文块
function buildSimulateContextBlock({ coreProfileText, prototypesRaw, idealScenario, agent3History, targetKey, answersText, resourceText }) {
  const parts = [];
  parts.push(coreProfileText);
  parts.push('【人生设计三原型（来自 Agent 2）】\n' + (prototypesRaw ? prototypesRaw.slice(0, 6000) : '（尚未生成人生设计，请基于用户档案推断三个可能原型）'));
  if (answersText) parts.push('【用户测试阶段的关键答案（含矛盾选项）】\n' + String(answersText).slice(0, 3000));
  if (resourceText) parts.push('【用户填写的可量化资源】\n' + String(resourceText).slice(0, 800));
  if (idealScenario) parts.push('【用户此前写下的理想结局 user_ideal_scenario】\n' + idealScenario.slice(0, 1200));
  if (agent3History && agent3History.length) {
    parts.push('【用户过往模拟记录 user_agent3_history】\n' +
      agent3History.map((h, i) => (i + 1) + '. 原型' + (h.prototypeKey || '') + '：' +
        (Array.isArray(h.choices) ? h.choices.map((c) => c.chosenText || '').join('；') : (h.ideal || ''))).join('\n'));
  }
  if (targetKey) parts.push('【目标原型】\n原型' + targetKey);
  return parts.join('\n\n');
}

export default async function handler(req, res) {
  const origin = req.headers.origin || 'null';
  const host = String(req.headers.host || '');
  const sameOrigin = origin !== 'null' && origin !== '' &&
    (origin === 'http://' + host || origin === 'https://' + host);
  if (!ALLOWED_ORIGINS[origin] && !sameOrigin) {
    return jsonErr(res, 'origin_forbidden', '来源不被允许', 403);
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url || '/', 'http://localhost');

  // ---- 用户身份：只认会话，不认前端传参 ----
  // 此前 GET 读 url.searchParams.userId、POST 读 body.userId，
  // 等于把「我是谁」交给前端决定，任何人都能填别人的 ID 读写他人数据。
  let currentUser;
  try {
    currentUser = await getCurrentUser(req);
  } catch (e) {
    console.error('[simulate] 会话校验失败：', e && e.message ? e.message : e);
    return res.status(500).json({ error: '服务暂时不可用，请稍后重试' });
  }
  if (!currentUser) return res.status(401).json({ error: '请先登录' });
  const userId = currentUser.id;

  // ---------- GET：进入模拟页时读取状态（不含防御机制映射） ----------
  if (req.method === 'GET') {
    const rec = await getUserRecord(userId);
    return res.status(200).json({
      ok: true,
      configured: true,
      prototypesRaw: (rec.prototypes && rec.prototypes.raw) || '',
      prototypes: (rec.prototypes && rec.prototypes.list) || [],
      idealScenario: rec.idealScenario || '',
      simulationCount: Array.isArray(rec.agent3History) ? rec.agent3History.length : 0
      // defenseMap 有意不返回前端
    });
  }

  if (req.method !== 'POST') return jsonErr(res, 'method_not_allowed', '仅支持 GET / POST', 405);

  let body;
  try { body = parseBody(req.body); } catch (e) { return jsonErr(res, 'bad_request', '请求格式不正确'); }
  const action = String(body.action || '').trim();

  // ---------- 1. 保存 Agent 2 的原型（设计页生成后调用） ----------
  if (action === 'save-prototypes') {
    await savePrototypes(userId, body.prototypesRaw || '', body.prototypes || []);
    return res.status(200).json({ ok: true, saved: true });
  }

  // ---------- 2. 生成原型专属模拟场景 ----------
  if (action === 'scenario') {
    const targetKey = String(body.prototypeKey || 'A').replace(/^原型/, '');
    const ctx = await assembleAgent3Context(userId, body);
    const contextBlock = buildSimulateContextBlock({
      coreProfileText: ctx.coreProfileText,
      prototypesRaw: ctx.prototypesRaw,
      idealScenario: ctx.idealScenario,
      agent3History: ctx.agent3History,
      targetKey,
      answersText: body.answersText,
      resourceText: body.resourceText
    });
    const style = classifyStyle({
      currentInput: String(body.styleSample || '').trim() || contextBlock,
      historyRounds: Array.isArray(body.historyRounds) ? body.historyRounds : [],
      coreQuotes: ctx.injectedContext.coreQuotes || []
    });
    const userMessage = contextBlock + '\n\n' + SIMULATE_PHASE_SCENARIO +
      (style.instruction ? '\n\n' + style.instruction : '');
    try {
      const raw = await callModel({
        provider: body.provider || 'deepseek',
        messages: [
          { role: 'system', content: AGENT_SIMULATOR },
          { role: 'user', content: userMessage }
        ],
        maxTokens: 6000,
        temperature: 0.8
      });
      const parsed = extractJson(raw);
      if (!parsed || !Array.isArray(parsed.scenarios) || !parsed.scenarios.length) {
        return jsonErr(res, 'scenario_parse_failed', '场景生成格式异常，请重试', 502);
      }
      // 生成后台防御机制映射表并落库（不返回前端）
      const map = {};
      const clientScenarios = parsed.scenarios.map((sc) => {
        const opts = Array.isArray(sc.options) ? sc.options : [];
        opts.forEach((o) => { if (o && o.key) map[String(o.key)] = String(o.defense || ''); });
        return {
          id: sc.id || '',
          title: sc.title || '',
          background: sc.background || '',
          question: sc.question || '',
          options: opts.map((o) => ({ key: String(o.key || ''), text: String(o.text || '') }))
        };
      });
      await saveDefenseMap(userId, targetKey, map);
      return res.status(200).json({
        ok: true,
        prototypeKey: targetKey,
        prototypeName: parsed.prototypeName || '',
        scenarios: clientScenarios,
        styleType: style.type,
        styleLabel: style.label
      });
    } catch (e) {
      return jsonErr(res, (e && e.code) || 'proxy_error', (e && e.message) || '场景生成失败', 502);
    }
  }

  // ---------- 3. 生成个性化解读 ----------
  if (action === 'interpret') {
    const targetKey = String(body.prototypeKey || 'A').replace(/^原型/, '');
    const ctx = await assembleAgent3Context(userId, body);
    const defenseMap = await getDefenseMap(userId, targetKey);
    const choices = Array.isArray(body.choices) ? body.choices : [];
    const choicesText = choices.map((c, i) =>
      (i + 1) + '. 场景「' + (c.title || '') + '」\n   题干：' + (c.question || '') +
      '\n   用户选择了：' + (c.chosenText || '') +
      (c.note ? '\n   用户补充想法：' + c.note : '')
    ).join('\n');
    const defenseText = choices.map((c) =>
      '· 场景' + (c.id || '') + ' 用户选择「' + (c.chosenText || '') + '」→ 后台标注的防御机制：' +
      (defenseMap[String(c.chosenKey || '')] || '未标注')
    ).join('\n');

    const contextBlock = buildSimulateContextBlock({
      coreProfileText: ctx.coreProfileText,
      prototypesRaw: ctx.prototypesRaw,
      idealScenario: ctx.idealScenario,
      agent3History: ctx.agent3History,
      targetKey,
      answersText: body.answersText,
      resourceText: body.resourceText
    });
    const userMessage = contextBlock +
      '\n\n【用户本次在该原型中的选择】\n' + choicesText +
      '\n\n【后台防御机制映射（仅你可读，请用日常语言转述，不要直接罗列术语表）】\n' + defenseText +
      '\n\n' + SIMULATE_PHASE_INTERPRET;
    try {
      const text = await callModel({
        provider: body.provider || 'deepseek',
        messages: [
          { role: 'system', content: AGENT_SIMULATOR },
          { role: 'user', content: userMessage }
        ],
        maxTokens: 8000,
        temperature: 0.8
      });
      await appendAgent3History(userId, {
        type: 'simulation',
        prototypeKey: targetKey,
        choices: choices.map((c) => ({ id: c.id, chosenKey: c.chosenKey, chosenText: c.chosenText, note: c.note || '' })),
        defenseUsed: choices.map((c) => defenseMap[String(c.chosenKey || '')] || '')
      });
      return res.status(200).json({ ok: true, prototypeKey: targetKey, text });
    } catch (e) {
      return jsonErr(res, (e && e.code) || 'proxy_error', (e && e.message) || '解读生成失败', 502);
    }
  }

  // ---------- 4. 保存理想结局（user_ideal_scenario）+ 触发自查刷新 ----------
  if (action === 'ideal') {
    const targetKey = String(body.prototypeKey || '').replace(/^原型/, '');
    const saved = await saveIdealScenario(userId, targetKey, body.ideal || '');
    return res.status(200).json({
      ok: true,
      idealScenario: saved.idealScenario,
      lastSelfCheckUpdate: saved.selfCheck ? saved.selfCheck.lastSelfCheckUpdate : null,
      forceRegenerateNextMirror: true,
      message: '你的档案已更新，下次自查和设计会基于这个新版本。'
    });
  }

  return jsonErr(res, 'unknown_action', '未知 action');
}

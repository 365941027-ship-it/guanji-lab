// 观己实验室 · 多角色 LLM 调度系统 /api/chat
// pageType:
//   test     -> agentExplorer  （测试解读页）
//   design   -> agentDesigner  （人生设计页）
//   simulate -> agentSimulator （模拟人生页）
//   mirror   -> agentMirror    （我的专属自查页）
//
// 动态拼接：每次调用前调用 userContextBuilder 组装用户实时档案，
// 以 “用户的实时档案数据：{...}。现在用户的问题是：...” 注入 user message。

import { resolveAgent } from '../prompts/index.js';
import { buildUserContext, buildCoreProfileBlock, buildAgentUserMessage } from '../userContextBuilder.js';
import { callModel } from '../lib/modelClient.js';
import { getSelfCheck, touchSelfCheck, shouldRegenerate } from '../lib/selfCheckStore.js';

const ALLOWED_ORIGINS = {
  'http://162.14.105.122:8787': true,
  'http://localhost:8787': true,
  'https://guanji-lab.vercel.app': true,
  'http://localhost:8777': true,
  'http://127.0.0.1:8777': true,
  'null': true // 允许同源/无来源（含本地调试与隐私模式），配合内测门禁使用
};

const EMOTION_WORDS = ['害怕', '担心', '焦虑', '迷茫'];
const ACTION_WORDS = ['计划', '下周', '安排', '具体'];

function countHits(text, words) {
  let n = 0;
  words.forEach((w) => {
    let i = 0;
    while (text.indexOf(w, i) > -1) { n += 1; i = text.indexOf(w, i) + w.length; }
  });
  return n;
}

function detectStyle(userInput, historyText) {
  // 风格判定依据：本次输入 + 历史输入摘要（用户历史里反复出现的情绪/行动词同样生效）
  const t = String(userInput || '') + '\n' + String(historyText || '');
  if (countHits(t, EMOTION_WORDS) >= 2) {
    return { mode: 'emotional', instruction: '风格要求：高情绪价值模式，每段先给情绪认可再给建议。' };
  }
  if (ACTION_WORDS.some((w) => t.indexOf(w) > -1)) {
    return { mode: 'action', instruction: '风格要求：高行动力模式，直接给步骤，禁止超过2句情绪铺垫。' };
  }
  return { mode: 'balanced', instruction: '' };
}

function parseBody(raw) {
  return typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
}

function jsonErr(res, code, message, status) {
  res.status(status || 400).json({ error: { code, message } });
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
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      provider: 'deepseek',
      ready: !!process.env.DEEPSEEK_API_KEY,
      agents: ['test', 'design', 'simulate', 'mirror']
    });
  }
  if (req.method !== 'POST') {
    return jsonErr(res, 'method_not_allowed', '仅支持 POST', 405);
  }

  let body;
  try { body = parseBody(req.body); } catch (e) {
    return jsonErr(res, 'bad_request', '请求格式不正确');
  }

  const pageType = String(body.pageType || '').trim();
  const agent = resolveAgent(pageType);
  if (!agent) {
    return jsonErr(res, 'unknown_agent', "pageType 必须是 test / design / simulate / mirror 之一");
  }

  // 用户问题：优先 userInput / question；兼容直接传 messages 的调用方
  let userInput = String(body.userInput || body.question || body.prompt || '').trim();
  if (!userInput && Array.isArray(body.messages)) {
    const lastUser = body.messages.slice().reverse().find((m) => m && m.role === 'user');
    if (lastUser) userInput = String(lastUser.content || '');
  }
  if (!userInput) {
    return jsonErr(res, 'empty_user_input', '没有收到用户输入内容');
  }

  // ---- 1. 组装动态用户上下文（档案 / 量化资源 / 测试历史 / 核心原话） ----
  const injectedContext = buildUserContext({
    profile: body.profile,
    history: body.history,
    recentInputs: body.recentInputs,
    growth: body.growth,
    designSnapshot: body.designSnapshot,
    extra: body.extra
  });

  // ---- 2. 语言风格适配（本次输入 + 历史输入共同判定） ----
  const historyText = (injectedContext.coreQuotes || []).map((q) => q.text).join(' ');
  const style = detectStyle(userInput, historyText);

  // ---- 3. 生成「用户核心档案」块（星座/八字关键词 可通过 GUAN_ASTRO_API_URL 接入外部轻量接口）----
  const coreProfile = await buildCoreProfileBlock(injectedContext);

  // ---- 4. 组装完整用户消息：核心档案 + 本次输入 + 交互规则 ----
  const userMessage = buildAgentUserMessage({
    coreProfileBlock: coreProfile.text,
    userInput,
    style
  });

  // 把结构化档案回写到 injectedContext，便于前端/排查看到实际拼进去的内容
  injectedContext.coreProfile = coreProfile.meta;

  const messages = [
    { role: 'system', content: agent.system },
    { role: 'user', content: userMessage }
  ];

  // ---- 5. “我的专属自查”刷新机制 ----
  const userId = String(body.userId || body.email || '').trim();
  let selfCheck = null;
  if (pageType === 'mirror') {
    selfCheck = shouldRegenerate(userId || null, body.lastSelfCheckUpdate || null);
    if (userId) touchSelfCheck(userId, body.source || 'mirror');
  } else if (userId && body.markSelfCheckUpdate === true) {
    // 用户在测试/设计完成后可显式调用此标记；也可走 /api/selfcheck/update
    selfCheck = touchSelfCheck(userId, body.source || pageType);
  }

  // ---- 6. 调用模型 ----
  try {
    const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 8000, 200), 8000);
    const temperature = typeof body.temperature === 'number' ? body.temperature : 0.8;
    const text = await callModel({
      provider: body.provider || 'deepseek',
      messages,
      maxTokens,
      temperature
    });
    return res.status(200).json({
      ok: true,
      pageType,
      agent: agent.name,
      styleMode: style.mode,
      styleInstruction: style.instruction,
      injectedContext,
      coreProfileBlock: coreProfile.text,
      userMessagePreview: userMessage.slice(0, 1200),
      selfCheck,
      text
    });
  } catch (e) {
    const msg = e && e.message ? e.message : '解读通道暂时不可用，请稍后重试';
    const code = (e && e.code) || 'proxy_error';
    return jsonErr(res, code, msg, code === 'no_server_key' ? 501 : 502);
  }
}

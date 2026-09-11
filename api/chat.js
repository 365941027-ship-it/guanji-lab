// 观己实验室 · 多角色 LLM 调度系统 /api/chat
// pageType:
//   test     -> agentExplorer  （测试解读页）
//   design   -> agentDesigner  （人生设计页）
//   simulate -> agentSimulator （模拟人生页）
//   mirror   -> agentMirror    （我的专属自查页）
//
// 动态拼接：每次调用前调用 userContextBuilder 组装用户实时档案，
// 以 “用户的实时档案数据：{...}。现在用户的问题是：...” 注入 user message。
//
// 【信任边界】本文件不再信任前端传入的 userId / email。
//   用户身份一律来自会话：server.js 解析 Cookie 得到 token，
//   这里通过 getCurrentUser 查 sessions 表校验有效性并取出用户 UUID。
//   未登录或会话过期一律返回 401，前端无法通过伪造 userId 读写他人数据。

import { resolveAgent } from '../prompts/index.js';
import { buildUserContext, buildCoreProfileBlock, buildAgentUserMessage } from '../userContextBuilder.js';
import { callModel } from '../lib/modelClient.js';
import { getSelfCheck, touchSelfCheck, shouldRegenerate } from '../lib/selfCheckStore.js';
import { classifyStyle } from '../lib/styleClassifier.js';
import { getIdealScenario } from '../lib/userStore.js';
import { getCurrentUser } from './auth.js';

const ALLOWED_ORIGINS = {
  'http://162.14.105.122:8787': true,
  'http://localhost:8787': true,
  'https://guanji-lab.vercel.app': true,
  'http://localhost:8777': true,
  'http://127.0.0.1:8777': true,
  'null': true // 允许同源/无来源（含本地调试与隐私模式），配合内测门禁使用
};

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

  // ---- 2. 系统级风格分类器（本次输入 + 最近3轮历史，频率 >30% 判定） ----
  const styleResult = classifyStyle({
    // styleSample：页面可传入「更干净的用户表达样本」（如仅含用户选项与手写原话，不含题干），
    // 避免题干措辞干扰频率统计；未提供时回退到本次输入。
    currentInput: String(body.styleSample || '').trim() || userInput,
    historyRounds: Array.isArray(body.historyRounds) ? body.historyRounds : [],
    coreQuotes: injectedContext.coreQuotes || []
  });
  const style = {
    mode: styleResult.styleMode,
    instruction: styleResult.instruction,
    type: styleResult.type,
    label: styleResult.label,
    stats: styleResult.stats
  };

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

  // ---- 用户身份：只认会话，不认前端传参 ----
  // 删除了原来的 String(body.userId || body.email) 写法：
  // 那等于把「我是谁」交给前端决定，任何人都能填别人的 ID 来读写他人数据。
  let currentUser;
  try {
    currentUser = await getCurrentUser(req);
  } catch (e) {
    console.error('[chat] 会话校验失败：', e && e.message ? e.message : e);
    return res.status(500).json({ error: '服务暂时不可用，请稍后重试' });
  }
  if (!currentUser) return res.status(401).json({ error: '请先登录' });
  const userId = currentUser.id;

  // Agent 4（专属自查）需要融入用户在人生模拟里写下的理想结局（user_ideal_scenario）
  let finalUserMessage = userMessage;
  if (pageType === 'mirror') {
    // 理想结局只从服务端存储读取；此前还允许 body.userIdealScenario 兜底，
    // 那等于让前端能往提示词里注入任意内容，一并去掉。
    const ideal = getIdealScenario(userId) || '';
    if (ideal) {
      finalUserMessage += '\n\n【用户在人生模拟中写下的理想结局 user_ideal_scenario】\n' + ideal.slice(0, 1500) +
        '\n（请在自查问题与解读中体现这个理想方向，并指出用户与它之间的距离。）';
      injectedContext.userIdealScenario = ideal;
    }
  }

  const messages = [
    { role: 'system', content: agent.system },
    { role: 'user', content: finalUserMessage }
  ];

  // ---- 5. “我的专属自查”刷新机制 ----
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
      styleType: style.type,
      styleLabel: style.label,
      styleStats: style.stats,
      styleInstruction: style.instruction,
      injectedContext,
      coreProfileBlock: coreProfile.text,
      userMessagePreview: finalUserMessage.slice(0, 1200),
      selfCheck,
      text
    });
  } catch (e) {
    const msg = e && e.message ? e.message : '解读通道暂时不可用，请稍后重试';
    const code = (e && e.code) || 'proxy_error';
    return jsonErr(res, code, msg, code === 'no_server_key' ? 501 : 502);
  }
}

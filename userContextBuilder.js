// 观己实验室 · 用户实时上下文装配器
// 说明：
//  当前站点使用“本地账号模式”，用户档案/测试历史/成长记录都在浏览器 localStorage，
//  服务器尚无数据库。因此本函数接收前端随请求带上来的 profile / history / recentInputs /
//  growth 等快照，组装成统一的 injectedContext JSON；未来接入数据库后，只需把快照来源
//  换成 DB 查询即可，函数签名与输出结构保持不变。

function pick(obj, keys) {
  if (!obj || typeof obj !== 'object') return {};
  const out = {};
  keys.forEach((k) => {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  });
  return out;
}

function safeJson(str, fallback) {
  if (str === undefined || str === null || str === '') return fallback;
  if (typeof str !== 'string') return str;
  try { return JSON.parse(str); } catch (e) { return fallback; }
}

function trimText(v, max) {
  const s = String(v == null ? '' : v).trim();
  return s.length > max ? s.slice(0, max) + '…' : s;
}

// 从档案里抽出“可量化”字段：时间投入、金钱预算等
function extractQuantified(profile) {
  if (!profile || typeof profile !== 'object') return {};
  const out = {};
  const timeKeys = ['time', 'timeInput', 'weeklyHours', 'hoursPerWeek', '可投入时间', '每周时间'];
  const moneyKeys = ['money', 'moneyInput', 'budget', 'monthlyBudget', '预算', '可投入预算'];
  timeKeys.forEach((k) => { if (profile[k]) out.timeBudget = trimText(profile[k], 120); });
  moneyKeys.forEach((k) => { if (profile[k]) out.moneyBudget = trimText(profile[k], 120); });
  if (!out.timeBudget && profile.timeBudget) out.timeBudget = trimText(profile.timeBudget, 120);
  if (!out.moneyBudget && profile.moneyBudget) out.moneyBudget = trimText(profile.moneyBudget, 120);
  return out;
}

// 从档案里抽出占星/命理关键词
function extractAstro(profile) {
  if (!profile || typeof profile !== 'object') return {};
  return pick(profile, [
    'zodiac', 'sunSign', 'rising', 'risingSign', 'moon', 'moonSign',
    'bazi', 'baziChart', 'fourPillars', 'astrology'
  ]);
}

function summarizeHistory(history, limit) {
  const n = Number(limit) > 0 ? Number(limit) : 3;
  if (!Array.isArray(history)) return [];
  return history.slice(-n).map((it) => {
    if (!it) return null;
    const result = typeof it.result === 'string' ? trimText(it.result, 180) : '';
    return {
      key: it.key || '',
      title: it.title || it.name || '',
      date: it.date || '',
      result: result
    };
  }).filter(Boolean);
}

// 取最近若干条“用户主动输入”（历史输入 / 成长笔记 / 自定义回答）
function summarizeRecentInputs(recentInputs, growth, limit) {
  const n = Number(limit) > 0 ? Number(limit) : 3;
  const items = [];
  if (Array.isArray(recentInputs)) {
    recentInputs.forEach((x) => {
      if (x && typeof x === 'string' && x.trim()) items.push({ source: 'input', text: trimText(x, 180) });
      else if (x && typeof x === 'object' && x.text) items.push({ source: 'input', text: trimText(x.text, 180) });
    });
  }
  if (Array.isArray(growth)) {
    growth.slice(-6).forEach((g) => {
      const note = (g && (g.note || g.text)) || '';
      if (String(note).trim()) items.push({ source: 'growth', text: trimText(note, 180) });
    });
  }
  return items.slice(-n);
}

/**
 * 组装用户上下文
 * @param {object} opts
 * @param {object} opts.profile       前端传来的用户档案（含星座/八字/MBTI/量化资源）
 * @param {array}  opts.history       最近测试历史（含结果摘要）
 * @param {array}  opts.recentInputs  最近用户主动输入（题目“其他”、设计输入等）
 * @param {array}  opts.growth        成长记录（笔记/日记）
 * @param {object} opts.designSnapshot 已保存的设计方案快照（可选）
 * @param {object} opts.extra         页面额外字段
 * @returns {object} injectedContext
 */
export function buildUserContext(opts) {
  const o = opts || {};
  const profile = safeJson(o.profile, {}) || {};
  const history = Array.isArray(o.history) ? o.history : safeJson(o.history, []);
  const growth = Array.isArray(o.growth) ? o.growth : safeJson(o.growth, []);
  const recentInputs = Array.isArray(o.recentInputs) ? o.recentInputs : safeJson(o.recentInputs, []);
  const design = safeJson(o.designSnapshot, {});
  const extra = o.extra || {};

  const injectedContext = {
    identity: pick(profile, [
      'nickname', 'name', 'gender', 'job', 'stage', 'selfDesc', 'focus',
      'mbti', 'ennea', 'age', 'city', 'education'
    ]),
    quantified: extractQuantified(profile),
    astro: extractAstro(profile),
    recentHistory: summarizeHistory(history, 3),
    recentInputs: summarizeRecentInputs(recentInputs, growth, 3),
    designSnapshot: {
      routes: (design && Array.isArray(design.routes)) ? design.routes.slice(0, 3).map((r) => ({ name: r.name || r.title || '', careers: r.careers || [], tag: r.tag || '' })) : [],
      inputs: (design && design.inputs) || {},
      updatedAt: (design && design.updatedAt) || ''
    },
    // 页面级补充（如当前测试的自定义“其他”回答、模拟选项）
    pageExtra: extra
  };
  return injectedContext;
}

/**
 * 生成“塞进用户消息开头”的实时档案文本。
 * @returns {string} 形如 用户的实时档案数据：{...}
 */
export function buildInjectedText(injectedContext) {
  return '用户的实时档案数据：' + JSON.stringify(injectedContext || {}) + '。';
}

export default buildUserContext;

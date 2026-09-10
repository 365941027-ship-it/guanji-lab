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

// ---------- 星座 / 八字简析：提取 2-3 个关键词 ----------
// 说明：默认使用内置关键词引擎（离线可用、零依赖、无外部调用失败风险）；
// 若配置了环境变量 GUAN_ASTRO_API_URL，则优先请求外部轻量接口，
// 接口需返回 { keywords: ["…","…","…"] }，失败时自动回退内置引擎。

const ZODIAC_KEYWORDS = {
  白羊座: ['开创', '行动先行', '直率'],
  金牛座: ['稳定', '感官敏锐', '慢热持久'],
  双子座: ['好奇', '信息流动', '思维跳跃'],
  巨蟹座: ['情感记忆', '守护', '安全感驱动'],
  狮子座: ['表达欲', '被看见', '慷慨'],
  处女座: ['秩序感', '细节敏锐', '服务倾向'],
  天秤座: ['平衡', '关系导向', '审美判断'],
  天蝎座: ['深度洞察', '转化力', '不轻易交心'],
  射手座: ['远方渴望', '意义追寻', '乐观直接'],
  摩羯座: ['长线主义', '责任感', '延迟满足'],
  水瓶座: ['独立思考', '抽离观察', '不走常规'],
  双鱼座: ['共情力', '边界柔软', '想象力丰富']
};

const ELEMENT_KEYWORDS = {
  木: '生长与开创',
  火: '热情与表达',
  土: '承载与稳定',
  金: '决断与边界',
  水: '流动与洞察'
};

function deriveAstroKeywords(astro) {
  const out = [];
  const zodiac = astro && (astro.zodiac || astro.sunSign);
  if (zodiac && ZODIAC_KEYWORDS[zodiac]) {
    out.push(...ZODIAC_KEYWORDS[zodiac].slice(0, 2));
  }
  const bazi = String((astro && (astro.bazi || astro.baziChart || astro.fourPillars)) || '');
  if (bazi) {
    const elements = ['木', '火', '土', '金', '水'];
    const counts = {};
    elements.forEach((e) => { counts[e] = (bazi.match(new RegExp(e, 'g')) || []).length; });
    const dominant = elements.sort((a, b) => counts[b] - counts[a])[0];
    if (counts[dominant] > 0 && ELEMENT_KEYWORDS[dominant]) out.push(ELEMENT_KEYWORDS[dominant]);
    // 八字四柱顺序：年柱 月柱 日柱 时柱 —— 日柱为第 3 柱（日主所在）
    const pillars = bazi.split(/\s+/).filter((p) => p.length >= 2);
    const dayPillar = pillars[2] || pillars[pillars.length - 1];
    if (dayPillar) out.push('日柱 ' + dayPillar);
  }
  if (astro && astro.rising) out.push('上升' + astro.rising);
  if (astro && astro.moon) out.push('月亮' + astro.moon);
  // 去重并最多保留 3 个
  return Array.from(new Set(out.filter(Boolean))).slice(0, 3);
}

async function fetchAstroKeywords(astro) {
  const local = deriveAstroKeywords(astro);
  const api = process.env.GUAN_ASTRO_API_URL;
  if (!api) return { keywords: local, source: 'builtin' };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const resp = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zodiac: astro.zodiac || astro.sunSign || '',
        bazi: astro.bazi || astro.baziChart || '',
        rising: astro.rising || '',
        moon: astro.moon || ''
      }),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    const data = await resp.json().catch(() => ({}));
    if (Array.isArray(data && data.keywords) && data.keywords.length) {
      return { keywords: data.keywords.slice(0, 3), source: 'api' };
    }
    return { keywords: local, source: 'builtin_fallback' };
  } catch (e) {
    return { keywords: local, source: 'builtin_fallback' };
  }
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
    // 供「最近一次测试结果」提取最突出标签使用的原始列表
    recentHistoryList: Array.isArray(history) ? history.slice(-3) : [],
    recentInputs: summarizeRecentInputs(recentInputs, growth, 3),
    // 用户说过最核心的 3 句话（含题目「其他」原话、成长记录）
    coreQuotes: pickCoreQuotes(recentInputs, growth, extra, 3),
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

// 最近一次测试：提取最突出的标签
function latestTestHighlight(history) {
  if (!Array.isArray(history) || !history.length) return null;
  const last = history[history.length - 1] || {};
  const raw = String(last.result || '').trim();
  if (!raw) return { title: last.title || '', highlight: '' };
  // 结果通常是「标签A · 标签B」形式，取第一个作为最突出标签
  const first = raw.split(/[·、,，|/]/)[0].trim();
  return {
    title: last.title || last.name || '',
    date: last.date || '',
    highlight: trimText(first || raw, 60)
  };
}

// 历史输入摘要：用户说过最核心的 3 句话
// 优先级：题目「其他」原话 > 成长记录 > 设计/模拟输入；按信息密度与情绪浓度排序
const CORE_SIGNAL_WORDS = ['我害怕', '我担心', '我想要', '我不想', '我发现', '我觉得', '我希望', '我总是', '我一直在', '我真正'];

function pickCoreQuotes(recentInputs, growth, extra, limit) {
  const n = Number(limit) > 0 ? Number(limit) : 3;
  const pool = [];
  const push = (text, source) => {
    const t = String(text || '').trim();
    if (t.length >= 6) pool.push({ text: trimText(t, 120), source });
  };

  if (Array.isArray(recentInputs)) {
    recentInputs.forEach((x) => {
      if (typeof x === 'string') push(x, 'input');
      else if (x && x.text) push(x.text, x.source || 'input');
    });
  }
  if (extra && Array.isArray(extra.otherAnswers)) extra.otherAnswers.forEach((t) => push(t, 'answer'));
  if (Array.isArray(growth)) growth.slice(-10).forEach((g) => push(g && (g.note || g.text), 'growth'));

  const scored = pool.map((item, idx) => {
    let score = 0;
    CORE_SIGNAL_WORDS.forEach((w) => { if (item.text.indexOf(w) > -1) score += 3; });
    if (item.source === 'answer') score += 4;      // 用户亲手写下的原话权重最高
    if (item.source === 'input') score += 2;
    score += Math.min(item.text.length, 60) / 30;  // 略偏好信息量大的句子
    score += idx / Math.max(pool.length, 1);        // 略偏好较新的内容
    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const seen = new Set();
  const out = [];
  for (const item of scored) {
    const key = item.text.slice(0, 12);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ text: item.text, source: item.source });
    if (out.length >= n) break;
  }
  return out;
}

/**
 * 组装完整的「用户核心档案」结构化文本（四大 Agent 共用）
 * 输出格式：
 *   【用户核心档案】
 *   - 星座/八字简析：…
 *   - 最近一次测试结果：…
 *   - 历史输入摘要：1. … 2. … 3. …
 */
export async function buildCoreProfileBlock(injectedContext) {
  const ctx = injectedContext || {};
  const astro = ctx.astro || {};
  const { keywords, source } = await fetchAstroKeywords(astro);
  const astroLine = keywords.length
    ? keywords.join('、') + (astro.zodiac ? '（' + astro.zodiac + '）' : '')
    : '（未填写出生信息，可提醒用户补充档案）';

  const latest = latestTestHighlight(ctx.recentHistoryList || []);
  const latestLine = latest && latest.highlight
    ? '《' + (latest.title || '最近一次测试') + '》最突出标签：' + latest.highlight
    : '（尚未完成测试）';

  const quotes = ctx.coreQuotes || [];
  const quotesLine = quotes.length
    ? quotes.map((q, i) => (i + 1) + '. 「' + q.text + '」').join('\n    ')
    : '（暂无历史输入）';

  return {
    text:
      '【用户核心档案】\n' +
      '- 星座/八字简析：' + astroLine + '\n' +
      '- 最近一次测试结果：' + latestLine + '\n' +
      '- 历史输入摘要：\n    ' + quotesLine,
    meta: { astroKeywords: keywords, astroSource: source, latestTest: latest, coreQuotes: quotes }
  };
}

/**
 * 生成完整用户消息（核心档案 + 本次输入 + 交互规则）
 */
export function buildAgentUserMessage({ coreProfileBlock, userInput, style }) {
  // 优先使用系统级风格分类器给出的完整指令；缺失时回退到按 mode 生成的简版说明。
  const styleLine = (style && style.instruction)
    ? style.instruction
    : (style && style.mode === 'emotional'
      ? '高情绪价值模式（多共情、多认可，先接住感受再给建议）。'
      : style && style.mode === 'action'
        ? '高行动力模式（多给具体步骤，少做情感铺垫，直接可执行）。'
        : '自然平衡模式（理性与共情兼顾）。');
  const rules = [
    '1. 本次回答中，至少引用【历史输入摘要】中的 1 句话（引用时请用原话）；',
    '2. 本次回答中，至少引用【用户核心档案】中的 1 个数据；',
    '3. 结尾必须推荐另一个具体测试，或引导用户进入人生设计；',
    '4. ' + styleLine
  ].join('\n');
  return coreProfileBlock + '\n\n' +
    '【本次输入】\n' + String(userInput || '').trim() + '\n\n' +
    '【交互规则】\n' + rules;
}

/**
 * 生成“塞进用户消息开头”的实时档案文本。
 * @returns {string} 形如 用户的实时档案数据：{...}
 */
export function buildInjectedText(injectedContext) {
  return '用户的实时档案数据：' + JSON.stringify(injectedContext || {}) + '。';
}

export default {
  buildUserContext,
  buildCoreProfileBlock,
  buildAgentUserMessage,
  buildInjectedText
};

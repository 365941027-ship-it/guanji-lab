// 观己实验室 · 系统级风格分类器
// 输入：用户本次输入 + 最近 3 轮历史记录
// 输出：用户类型（A 敏感型 / B 行动型 / C 中性），以及对应的回应风格指令。
//
// 判定方式：把「本次输入 + 最近3轮历史」切成短句（以中文/英文标点断句），
// 统计含情绪词、含行动词的短句各自占比；占比 > 30% 即判定为该类型。
// 两类同时超标时，占比更高者优先；完全未超标则为中性型。

// —— 类型 A：敏感型触发词 ——
const EMOTION_MARKERS = [
  // 完整短语（强信号）
  '我害怕', '我不确定', '我担心', '我怕', '我焦虑', '我迷茫', '我不敢',
  '我很难', '我难受', '我很累', '我撑不住', '我不知道', '我是不是',
  '是不是不够', '配不配', '我在意',
  // 裸词（弱信号，单独出现亦可判定）
  '害怕', '担心', '焦虑', '迷茫', '不安', '孤独', '疲惫', '崩溃',
  '难受', '委屈', '内耗', '自责', '无措', '纠结', '痛苦'
];

// —— 类型 B：行动型触发词 ——
const ACTION_MARKERS = [
  // 完整短语（强信号）
  '我要', '我计划', '我打算', '下周', '这周', '明天', '第一步',
  '怎么开始', '时间表', '每天花', '截止日期',
  // 裸词（弱信号）
  '具体', '安排', '目标', '截止', '多久', '多少', '步骤',
  '每天', '几点', '预算', '计划', '清单', '可执行', '落地'
];

const MAX_ROUNDS = 3;          // 只统计最近 3 轮
const THRESHOLD = 0.3;         // 频率阈值 30%

// 断句：按中文与英文标点、换行切分
function splitClauses(text) {
  return String(text || '')
    .split(/[，。！？；、,.!?;\n\r]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

function containsAny(clause, markers) {
  return markers.some((m) => clause.indexOf(m) > -1);
}

/**
 * 分类用户风格
 * @param {object} opts
 * @param {string} opts.currentInput  本次输入
 * @param {Array}  opts.historyRounds 最近几轮历史（字符串或 {text} 对象数组），只取最后 3 轮
 * @param {Array}  opts.coreQuotes    历史核心原话（{text} 数组），作为历史轮次不足时的补充
 * @returns {object} { type, label, emotionRatio, actionRatio, styleMode, instruction, stats }
 */
export function classifyStyle(opts) {
  const o = opts || {};
  const rounds = [];

  // 本次输入
  const current = String(o.currentInput || '').trim();
  if (current) rounds.push(current);

  // 最近 3 轮历史（越近越靠后，取尾部 3 条）
  const hist = Array.isArray(o.historyRounds) ? o.historyRounds : [];
  hist.slice(-MAX_ROUNDS).forEach((r) => {
    if (typeof r === 'string' && r.trim()) rounds.push(r.trim());
    else if (r && typeof r.text === 'string' && r.text.trim()) rounds.push(r.text.trim());
  });

  // 历史轮次不足时，用核心原话补足（最多凑到 4 段：本次 + 3 轮）
  if (rounds.length < 2 && Array.isArray(o.coreQuotes)) {
    o.coreQuotes.slice(-MAX_ROUNDS).forEach((q) => {
      const t = q && q.text ? String(q.text).trim() : '';
      if (t) rounds.push(t);
    });
  }

  const clauses = [];
  rounds.forEach((r) => { clauses.push(...splitClauses(r)); });

  // 无有效短句时按中性处理
  if (!clauses.length) {
    return {
      type: 'C',
      label: '中性型',
      styleMode: 'balanced',
      emotionRatio: 0,
      actionRatio: 0,
      instruction: '',
      stats: { rounds: rounds.length, clauses: 0, emotionHits: 0, actionHits: 0 }
    };
  }

  const emotionHits = clauses.filter((c) => containsAny(c, EMOTION_MARKERS)).length;
  const actionHits = clauses.filter((c) => containsAny(c, ACTION_MARKERS)).length;
  const emotionRatio = emotionHits / clauses.length;
  const actionRatio = actionHits / clauses.length;

  const isEmotion = emotionRatio > THRESHOLD;
  const isAction = actionRatio > THRESHOLD;

  const stats = {
    rounds: rounds.length,
    clauses: clauses.length,
    emotionHits,
    actionHits,
    emotionRatio: Number(emotionRatio.toFixed(3)),
    actionRatio: Number(actionRatio.toFixed(3))
  };

  // 类型 A：敏感型（两类同时触发时按占比较高者）
  if (isEmotion && (!isAction || emotionRatio >= actionRatio)) {
    return {
      type: 'A',
      label: '敏感型',
      styleMode: 'emotional',
      emotionRatio,
      actionRatio,
      instruction:
        '风格要求：用户属于「敏感型」。每段开头必须先给一句情绪认可（例如“我能感觉到你在……时的不安”），' +
        '先接住感受，再给建议；语气温柔、不催促、不评判，避免堆砌解决方案。',
      stats
    };
  }

  // 类型 B：行动型
  if (isAction) {
    return {
      type: 'B',
      label: '行动型',
      styleMode: 'action',
      emotionRatio,
      actionRatio,
      instruction:
        '风格要求：用户属于「行动型」。直接给可执行步骤（含时间、数量、做法），' +
        '禁止超过 2 句情绪铺垫；不要空泛安慰，用具体动作回应。',
      stats
    };
  }

  // 类型 C：中性型
  return {
    type: 'C',
    label: '中性型',
    styleMode: 'balanced',
    emotionRatio,
    actionRatio,
    instruction: '',
    stats
  };
}

/**
 * 把分类结果转成追加到用户消息末尾的指令文本（保持与原有交互规则一致）
 */
export function styleInstructionOf(result) {
  return result && result.instruction ? result.instruction : '';
}

export const STYLE_MARKERS = {
  emotion: EMOTION_MARKERS,
  action: ACTION_MARKERS
};

export default { classifyStyle, styleInstructionOf, STYLE_MARKERS };

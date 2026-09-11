// 观己实验室 · 用户 Agent 状态存储（Agent 2 / Agent 3 相关字段）
//
// 【重要】userId 是 users.id（UUID），不再是邮箱。
//   上游（api/chat.js、api/simulate.js）已改为从会话取 UUID，不再信任前端传参。
//
// 数据落在 PostgreSQL 的 user_agent_state 表，通过 lib/repos/profileRepo.js 读写：
//   prototypes          → prototypes            （JSONB）
//   defenseMap          → defense_map           （JSONB，仅后台使用，不返回前端）
//   agent3History       → agent3_history        （JSONB）
//   idealScenario       → ideal_scenario        （TEXT）
//   lastSelfCheckUpdate → last_self_check_update（TIMESTAMPTZ，由 selfCheckStore 维护）
//
// 对外函数名与参数保持不变（但都变成了 async，调用方需要 await）。
import { getAgentState, upsertAgentState, updateAgentStateField } from './repos/profileRepo.js';
import { touchSelfCheck } from './selfCheckStore.js';

const MAX_HISTORY = 50;

/** 无记录时返回的空状态，形状与有记录时一致，调用方不用判空 */
function blank() {
  return {
    prototypes: null,        // Agent 2 最近一次输出的三个原型（{raw, list, updatedAt}）
    defenseMap: {},          // { "原型A": { "A": "合理化", ... } }
    agent3History: [],       // 每次模拟的选择记录
    idealScenario: '',       // 用户提交的理想结局
    lastSelfCheckUpdate: '',
    updatedAt: ''
  };
}

function prototypeLabel(prototypeKey) {
  return '原型' + String(prototypeKey || '').replace(/^原型/, '');
}

/**
 * 读取用户的完整 Agent 状态
 * @param {string} userId UUID
 * @returns {Promise<object>} 永不为 null；无记录时返回空状态
 */
export async function getUserRecord(userId) {
  if (!userId) return blank();
  const row = await getAgentState(userId);
  if (!row) return blank();
  return {
    prototypes: row.prototypes || null,
    defenseMap: row.defenseMap || {},
    agent3History: Array.isArray(row.agent3History) ? row.agent3History : [],
    idealScenario: row.idealScenario || '',
    lastSelfCheckUpdate: row.lastSelfCheckUpdate || '',
    updatedAt: row.updatedAt || ''
  };
}

/**
 * 保存 Agent 2 生成的原型（进入模拟页时供 Agent 3 读取）
 * @param {string} userId UUID
 * @param {string} prototypesRaw Agent 2 输出的完整文本
 * @param {Array}  prototypes 结构化原型（可选，[{key,name,careers,shortboard,fit}]）
 */
export async function savePrototypes(userId, prototypesRaw, prototypes) {
  const value = {
    raw: String(prototypesRaw || '').slice(0, 20000),
    list: Array.isArray(prototypes) ? prototypes.slice(0, 3) : [],
    updatedAt: new Date().toISOString()
  };
  return upsertAgentState(userId, { prototypes: value });
}

/**
 * 保存某原型的「防御机制映射表」（仅后台使用，不返回前端）
 * 注：这里是「先读再写」，理论上存在并发覆盖的可能；
 *     实际每个用户的原型场景是顺序生成、单独写入，触发概率极低。
 */
export async function saveDefenseMap(userId, prototypeKey, map) {
  const cur = await getAgentState(userId);
  const merged = Object.assign({}, (cur && cur.defenseMap) || {});
  merged[prototypeLabel(prototypeKey)] = map || {};
  return upsertAgentState(userId, { defenseMap: merged });
}

/** 读取某原型的防御机制映射表 */
export async function getDefenseMap(userId, prototypeKey) {
  const cur = await getAgentState(userId);
  const all = (cur && cur.defenseMap) || {};
  return all[prototypeLabel(prototypeKey)] || {};
}

/** 追加一次模拟的选择记录（user_agent3_history） */
export async function appendAgent3History(userId, entry) {
  const cur = await getAgentState(userId);
  const list = Array.isArray(cur && cur.agent3History) ? cur.agent3History.slice() : [];
  list.push(Object.assign({ at: new Date().toISOString() }, entry || {}));
  return upsertAgentState(userId, { agent3History: list.slice(-MAX_HISTORY) });
}

/**
 * 读取模拟历史（供 Agent 4 引用）
 * @param {string} userId UUID
 * @param {number} limit 取最近几条，默认 3
 */
export async function getAgent3History(userId, limit) {
  const cur = await getAgentState(userId);
  const list = Array.isArray(cur && cur.agent3History) ? cur.agent3History : [];
  const n = Number(limit) > 0 ? Number(limit) : 3;
  return list.slice(-n);
}

/**
 * 保存用户提交的理想结局（user_ideal_scenario）
 * 同时触发 lastSelfCheckUpdate 刷新，使下次 Agent 4 强制重新生成自查。
 */
export async function saveIdealScenario(userId, prototypeKey, ideal) {
  const text = String(ideal || '').trim().slice(0, 4000);
  await updateAgentStateField(userId, 'idealScenario', text);
  const selfCheck = await touchSelfCheck(userId, 'agent3_ideal');
  // 历史记录属于辅助信息：即使写入失败，也不该让用户丢失刚提交的理想结局，
  // 所以这里单独兜住异常，只记日志。
  try {
    await appendAgent3History(userId, { type: 'ideal', prototypeKey, ideal: text });
  } catch (e) {
    console.error('[userStore] 追加模拟历史失败（不影响理想结局保存）：', e && e.message ? e.message : e);
  }
  return { idealScenario: text, selfCheck };
}

/** 读取理想结局（供 Agent 3 上下文与 Agent 4 自查引用） */
export async function getIdealScenario(userId) {
  const cur = await getAgentState(userId);
  return (cur && cur.idealScenario) || '';
}

export default {
  getUserRecord,
  savePrototypes,
  saveDefenseMap,
  getDefenseMap,
  appendAgent3History,
  getAgent3History,
  saveIdealScenario,
  getIdealScenario
};

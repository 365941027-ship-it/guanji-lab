// 观己实验室 · 用户档案表数据访问层
//
// 这里负责一件容易被忽略的脏活：表结构与前端数据形状的映射。
//
//   profiles 表的列：user_id / birth_data(jsonb) / zodiac / mbti / basic_info(jsonb) / updated_at
//   前端用的形状：  { nickname, gender, job, avatar, birth, hour, city, mbti, ennea, stage, ... }
//
// 上层（api/account.js）只跟「前端形状」打交道，映射规则收敛在本文件里，
// 以后要调整字段归类，只改这里，接口和前端都不用动。
import { query } from '../db.js';

// 出生信息（用于排盘）：日期、时辰、出生地、上升、月亮、八字
const BIRTH_KEYS = ['birth', 'hour', 'city', 'rising', 'moon', 'bazi'];
// 其他基础资料：昵称、性别、职业、头像、九型、阶段、自我描述、探索议题
const BASIC_KEYS = ['nickname', 'gender', 'job', 'avatar', 'ennea', 'stage', 'selfDesc', 'focus'];
// 单独成列的两个字段
const COLUMN_KEYS = ['zodiac', 'mbti'];

const ALL_KEYS = BIRTH_KEYS.concat(BASIC_KEYS, COLUMN_KEYS);

function pickKeys(obj, keys) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  keys.forEach((k) => {
    const v = obj[k];
    // 空字符串视为「未填写」，不写入 jsonb，避免脏数据
    if (v !== undefined && v !== null && String(v).trim() !== '') out[k] = v;
  });
  return out;
}

function toText(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s.slice(0, 128);
}

/**
 * 把前端形状的档案对象拆成数据库的四列
 * @param {object} data 前端传来的档案
 * @returns {{birth_data: object|null, zodiac: string|null, mbti: string|null, basic_info: object|null}}
 */
function splitToColumns(data) {
  const birth = pickKeys(data, BIRTH_KEYS);
  const basic = pickKeys(data, BASIC_KEYS);
  return {
    birth_data: Object.keys(birth).length ? birth : null,
    zodiac: toText(data && data.zodiac),
    mbti: toText(data && data.mbti),
    basic_info: Object.keys(basic).length ? basic : null
  };
}

/**
 * 把数据库的一行还原成前端形状
 * @param {object|null} row
 * @returns {object|null}
 */
function rowToProfile(row) {
  if (!row) return null;
  const birth = (row.birth_data && typeof row.birth_data === 'object') ? row.birth_data : {};
  const basic = (row.basic_info && typeof row.basic_info === 'object') ? row.basic_info : {};
  return Object.assign({}, birth, basic, {
    zodiac: row.zodiac || birth.zodiac || '',
    mbti: row.mbti || basic.mbti || '',
    updatedAt: row.updated_at || null
  });
}

const RETURN_COLUMNS = 'user_id, birth_data, zodiac, mbti, basic_info, updated_at';

/**
 * 读取用户档案
 * @param {string} userId
 * @returns {Promise<object|null>} 前端形状的档案对象；没有档案时返回 null
 */
export async function getProfile(userId) {
  if (!userId) return null;
  const r = await query(
    `SELECT ${RETURN_COLUMNS} FROM profiles WHERE user_id = $1 LIMIT 1`,
    [userId]
  );
  return rowToProfile(r.rows[0] || null);
}

/**
 * 写入用户档案：存在则更新，不存在则插入。
 *
 * 默认采用「合并」语义：只覆盖本次传入的字段，没传的字段保持原值。
 * 这样做是为了防止「只想改 MBTI，结果把出生日期冲掉了」这类误伤。
 * 需要整份覆盖时，传 merge = false。
 *
 * @param {string} userId
 * @param {object} data   前端形状的档案对象
 * @param {object} [opts]
 * @param {boolean} [opts.merge=true] true=合并（默认），false=整份覆盖
 * @returns {Promise<object|null>} 写入后的完整档案（前端形状）
 */
export async function upsertProfile(userId, data, opts) {
  if (!userId) throw new Error('upsertProfile 需要 userId');
  const merge = !(opts && opts.merge === false);
  const cols = splitToColumns(data || {});

  // 合并语义用 jsonb 的 || 运算符在数据库里完成，避免「先读再写」带来的竞态。
  // 注意：jsonb || NULL 结果是 NULL，所以两侧都要 COALESCE 成空对象。
  const birthExpr = merge
    ? "COALESCE(profiles.birth_data, '{}'::jsonb) || COALESCE(EXCLUDED.birth_data, '{}'::jsonb)"
    : 'EXCLUDED.birth_data';
  const basicExpr = merge
    ? "COALESCE(profiles.basic_info, '{}'::jsonb) || COALESCE(EXCLUDED.basic_info, '{}'::jsonb)"
    : 'EXCLUDED.basic_info';
  // 文本列：本次没传就保留旧值，避免被 null 覆盖
  const zodiacExpr = merge ? 'COALESCE(EXCLUDED.zodiac, profiles.zodiac)' : 'EXCLUDED.zodiac';
  const mbtiExpr = merge ? 'COALESCE(EXCLUDED.mbti, profiles.mbti)' : 'EXCLUDED.mbti';

  const r = await query(
    `INSERT INTO profiles (user_id, birth_data, zodiac, mbti, basic_info, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id) DO UPDATE
        SET birth_data = ${birthExpr},
            basic_info = ${basicExpr},
            zodiac     = ${zodiacExpr},
            mbti       = ${mbtiExpr},
            updated_at = now()
     RETURNING ${RETURN_COLUMNS}`,
    [userId, cols.birth_data, cols.zodiac, cols.mbti, cols.basic_info]
  );
  return rowToProfile(r.rows[0] || null);
}

/**
 * 删除用户档案（用户注销时使用；正常流程下由外键级联自动处理）
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function deleteProfile(userId) {
  if (!userId) return false;
  const r = await query('DELETE FROM profiles WHERE user_id = $1', [userId]);
  return r.rowCount > 0;
}

/** 字段归类白名单，供上层校验或文档参考 */
export const PROFILE_FIELDS = {
  birth: BIRTH_KEYS,
  basic: BASIC_KEYS,
  columns: COLUMN_KEYS,
  all: ALL_KEYS
};

// ============================================================
// user_agent_state：Agent 跨会话状态（原型 / 防御映射 / 模拟历史 / 理想结局 / 自查刷新时间）
// ============================================================

// JS 字段名 ↔ 数据库列名。
// updateAgentStateField 用它的 key 做白名单校验：SQL 的列名不能用 $1 占位符，
// 所以列名必须来自这份固定映射，绝不能拼接外部传入的字符串（那是注入漏洞）。
const AGENT_STATE_FIELDS = {
  prototypes: 'prototypes',
  defenseMap: 'defense_map',
  agent3History: 'agent3_history',
  idealScenario: 'ideal_scenario',
  lastSelfCheckUpdate: 'last_self_check_update'
};

const AGENT_STATE_COLUMNS =
  'user_id, prototypes, defense_map, agent3_history, ideal_scenario, last_self_check_update, updated_at';

// 需要按 JSON 序列化传入的列。
// 必须显式 JSON.stringify：node-postgres 遇到 JS 数组会按「PostgreSQL 数组字面量」
// 处理（生成 {...}），写进 jsonb 列会报 "invalid input syntax for type json"。
// 对象恰好被 pg 转成 JSON，所以只有数组会踩这个坑，但这里统一处理更安全。
const AGENT_STATE_JSONB_COLUMNS = new Set(['prototypes', 'defense_map', 'agent3_history']);

function serializeAgentStateValue(dbCol, value) {
  if (value === undefined || value === null) return null;
  if (!AGENT_STATE_JSONB_COLUMNS.has(dbCol)) return value;
  if (typeof value === 'string') {
    // 已经是合法 JSON 文本就直接用；否则当作 JSON 字符串值处理
    try { JSON.parse(value); return value; } catch (e) { return JSON.stringify(value); }
  }
  return JSON.stringify(value);
}

function toIso(v) {
  if (!v) return '';
  try { return v instanceof Date ? v.toISOString() : String(v); } catch (e) { return ''; }
}

/** 数据库行 → JS 对象（并把 NULL 兜底成语义等价的空值） */
function rowToAgentState(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    prototypes: row.prototypes || null,
    defenseMap: (row.defense_map && typeof row.defense_map === 'object') ? row.defense_map : {},
    agent3History: Array.isArray(row.agent3_history) ? row.agent3_history : [],
    idealScenario: row.ideal_scenario || '',
    lastSelfCheckUpdate: toIso(row.last_self_check_update),
    updatedAt: toIso(row.updated_at)
  };
}

/**
 * 读取用户的 Agent 状态整行
 * @param {string} userId users.id（UUID）
 * @returns {Promise<object|null>} 无记录时返回 null
 */
export async function getAgentState(userId) {
  if (!userId) return null;
  const r = await query(
    `SELECT ${AGENT_STATE_COLUMNS} FROM user_agent_state WHERE user_id = $1 LIMIT 1`,
    [userId]
  );
  return rowToAgentState(r.rows[0] || null);
}

/**
 * 写入 Agent 状态：存在则更新，不存在则插入。
 * 只更新 data 里出现的字段，未出现的列保持原值（避免「只改一个字段把别的清空」）。
 * @param {string} userId
 * @param {object} data 可含 prototypes / defenseMap / agent3History / idealScenario / lastSelfCheckUpdate
 * @returns {Promise<object>} 写入后的整行
 */
export async function upsertAgentState(userId, data) {
  if (!userId) throw new Error('upsertAgentState 需要 userId');
  const payload = data || {};
  const cols = [];
  const params = [userId];
  const sets = [];

  Object.keys(AGENT_STATE_FIELDS).forEach((jsKey) => {
    if (!Object.prototype.hasOwnProperty.call(payload, jsKey)) return;
    const dbCol = AGENT_STATE_FIELDS[jsKey];
    cols.push(dbCol);
    params.push(serializeAgentStateValue(dbCol, payload[jsKey]));
    sets.push(dbCol + ' = EXCLUDED.' + dbCol);
  });

  // 没有任何可写字段时，只确保这一行存在（后续可单独更新某列）
  if (!cols.length) {
    const r0 = await query(
      `INSERT INTO user_agent_state (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
       RETURNING ${AGENT_STATE_COLUMNS}`,
      [userId]
    );
    return rowToAgentState(r0.rows[0] || null);
  }

  const placeholders = cols.map((_, i) => '$' + (i + 2));
  const r = await query(
    `INSERT INTO user_agent_state (user_id, ${cols.join(', ')})
     VALUES ($1, ${placeholders.join(', ')})
     ON CONFLICT (user_id) DO UPDATE
        SET ${sets.join(', ')}, updated_at = now()
     RETURNING ${AGENT_STATE_COLUMNS}`,
    params
  );
  return rowToAgentState(r.rows[0] || null);
}

/**
 * 只更新某一个字段（不存在该行则先建行再写）
 * @param {string} userId
 * @param {string} field 必须是 AGENT_STATE_FIELDS 里的键，否则抛错
 * @param {*} value
 * @returns {Promise<object>} 写入后的整行
 */
export async function updateAgentStateField(userId, field, value) {
  if (!userId) throw new Error('updateAgentStateField 需要 userId');
  const dbCol = AGENT_STATE_FIELDS[field];
  if (!dbCol) throw new Error('不支持的字段：' + field);

  const r = await query(
    `INSERT INTO user_agent_state (user_id, ${dbCol})
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE
        SET ${dbCol} = EXCLUDED.${dbCol}, updated_at = now()
     RETURNING ${AGENT_STATE_COLUMNS}`,
    [userId, serializeAgentStateValue(dbCol, value)]
  );
  return rowToAgentState(r.rows[0] || null);
}

/** Agent 状态字段白名单（供上层校验或文档参考） */
export const AGENT_STATE_FIELD_MAP = AGENT_STATE_FIELDS;

export default {
  getProfile,
  upsertProfile,
  deleteProfile,
  PROFILE_FIELDS,
  getAgentState,
  upsertAgentState,
  updateAgentStateField,
  AGENT_STATE_FIELD_MAP
};

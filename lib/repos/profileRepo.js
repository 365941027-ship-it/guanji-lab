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

export default { getProfile, upsertProfile, deleteProfile, PROFILE_FIELDS };

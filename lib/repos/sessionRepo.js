// 观己实验室 · 会话表数据访问层
// 只负责 sessions 表的读写。会话令牌由服务端生成，客户端只持有随机字符串，
// 服务端可通过删除记录让它立即失效（这是不用 JWT 的好处）。
import crypto from 'node:crypto';
import { query } from '../db.js';

// 会话有效期：7 天，与 Cookie 的 Max-Age 保持一致。
// 两处必须同步，否则会出现「Cookie 还在但服务端已判定过期」的情况。
export const SESSION_DAYS = 7;

const TOKEN_BYTES = 32;   // 32 字节 = 64 位十六进制字符，暴力猜测不可行

function expiryExpression() {
  return `now() + interval '${SESSION_DAYS} days'`;
}

/**
 * 创建会话
 * @param {string} userId users.id（UUID）
 * @returns {Promise<string>} 新生成的 token
 */
export async function createSession(userId) {
  if (!userId) throw new Error('createSession 需要 userId');
  const token = crypto.randomBytes(TOKEN_BYTES).toString('hex');
  await query(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES ($1, $2, ${expiryExpression()})`,
    [token, userId]
  );
  return token;
}

/**
 * 查找未过期的会话
 * 过期判断放在 SQL 里完成（expires_at > now()），避免依赖服务器时区。
 * @param {string} token
 * @returns {Promise<object|null>} 有效会话 {token, user_id, expires_at}，无效或已过期返回 null
 */
export async function findValidSession(token) {
  if (!token || typeof token !== 'string') return null;
  const r = await query(
    `SELECT token, user_id, expires_at
       FROM sessions
      WHERE token = $1
        AND expires_at > now()
      LIMIT 1`,
    [token]
  );
  return r.rows[0] || null;
}

/**
 * 删除会话（登出）
 * @param {string} token
 * @returns {Promise<boolean>} 是否真的删掉了一条记录
 */
export async function deleteSession(token) {
  if (!token) return false;
  const r = await query('DELETE FROM sessions WHERE token = $1', [token]);
  return r.rowCount > 0;
}

/**
 * 续期：用户持续活跃时延长会话，避免用到第 7 天被强制登出。
 * 每次调用只更新这一条记录，成本极低。
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function touchSession(token) {
  if (!token) return false;
  const r = await query(
    `UPDATE sessions
        SET expires_at = ${expiryExpression()}
      WHERE token = $1
        AND expires_at > now()`,
    [token]
  );
  return r.rowCount > 0;
}

/**
 * 清理所有已过期的会话。
 * 由定时任务或服务启动时调用；不清理也不影响正确性（查询时已过滤过期），
 * 只是防止表无限增长。
 * @returns {Promise<number>} 删除条数
 */
export async function deleteExpiredSessions() {
  const r = await query('DELETE FROM sessions WHERE expires_at <= now()');
  return r.rowCount;
}

/**
 * 删除某个用户的全部会话（改密码、封禁账号时使用）
 * @param {string} userId
 * @returns {Promise<number>} 删除条数
 */
export async function deleteUserSessions(userId) {
  if (!userId) return 0;
  const r = await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
  return r.rowCount;
}

export default {
  createSession,
  findValidSession,
  deleteSession,
  touchSession,
  deleteExpiredSessions,
  deleteUserSessions,
  SESSION_DAYS
};

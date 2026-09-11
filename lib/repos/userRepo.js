// 观己实验室 · 用户表数据访问层
// 只负责 users 表的读写，不含业务判断（比如「邮箱是否已注册」由上层处理）。
// 所有 SQL 使用 $1 $2 占位符，杜绝字符串拼接带来的注入风险。
import { query } from '../db.js';

// 邮箱统一转小写并去空格：避免同一个邮箱因大小写不同被注册两次。
function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// 统一挑选要返回的字段：绝不把 password_hash 返回给上层，
// 这样即使上层不小心把整个对象返回给前端，也不会泄露密码哈希。
const PUBLIC_FIELDS = 'id, email, nickname, created_at';

/**
 * 创建用户
 * @param {string} email        邮箱（内部会转小写）
 * @param {string} passwordHash 已哈希的密码（由 lib/password.js 生成，这里不接触明文）
 * @param {string|null} nickname 昵称，可为空
 * @returns {Promise<object|null>} 新建的用户对象（不含密码哈希）
 */
export async function createUser(email, passwordHash, nickname) {
  const mail = normalizeEmail(email);
  const nick = nickname ? String(nickname).trim().slice(0, 40) : null;
  const r = await query(
    `INSERT INTO users (email, password_hash, nickname)
     VALUES ($1, $2, $3)
     RETURNING ${PUBLIC_FIELDS}`,
    [mail, passwordHash, nick]
  );
  return r.rows[0] || null;
}

/**
 * 按邮箱查找用户（登录时使用）
 * 注意：这个查询会带上 password_hash，因为登录必须校验密码。
 * 调用方在验证完成后，务必只把 PUBLIC_FIELDS 返回给前端。
 * @param {string} email
 * @returns {Promise<object|null>} 含 password_hash 的完整用户对象
 */
export async function findByEmail(email) {
  const mail = normalizeEmail(email);
  if (!mail) return null;
  const r = await query(
    `SELECT id, email, nickname, created_at, password_hash
       FROM users
      WHERE email = $1
      LIMIT 1`,
    [mail]
  );
  return r.rows[0] || null;
}

/**
 * 按 id 查找用户（会话恢复、读取当前登录用户时使用）
 * @param {string} id UUID
 * @returns {Promise<object|null>} 不含密码哈希的用户对象
 */
export async function findById(id) {
  if (!id) return null;
  const r = await query(
    `SELECT ${PUBLIC_FIELDS}
       FROM users
      WHERE id = $1
      LIMIT 1`,
    [id]
  );
  return r.rows[0] || null;
}

/** 供上层复用的字段白名单（避免各处重复写） */
export const USER_PUBLIC_FIELDS = PUBLIC_FIELDS;

export default { createUser, findByEmail, findById, USER_PUBLIC_FIELDS };

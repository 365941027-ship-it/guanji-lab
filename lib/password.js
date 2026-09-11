// 观己实验室 · 密码哈希
// 使用 Node 标准库 crypto.scrypt —— 与 bcrypt 同属 OWASP 推荐的密码哈希算法，
// 但无需任何第三方依赖、无需本地编译，适合当前零依赖的项目。
//
// 存储格式（单字段，自带算法参数与盐，便于以后升级参数而不影响老密码）：
//   scrypt$16384$8$1$<salt-hex>$<hash-hex>
import crypto from 'node:crypto';

const N = 16384;        // CPU/内存成本，2^14；内存占用约 128*N*r ≈ 16MB
const R = 8;            // 块大小
const P = 1;            // 并行度
const KEY_LEN = 64;     // 派生密钥长度（字节）
const SALT_LEN = 16;    // 盐长度（字节）

function scryptAsync(password, salt, keylen, opts) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, opts, (err, derived) => {
      if (err) reject(err);
      else resolve(derived);
    });
  });
}

/**
 * 生成密码哈希
 * @param {string} plain 明文密码
 * @returns {Promise<string>} 形如 scrypt$16384$8$1$salt$hash
 */
export async function hashPassword(plain) {
  const pwd = String(plain || '');
  if (!pwd) throw new Error('密码不能为空');
  const salt = crypto.randomBytes(SALT_LEN);
  const derived = await scryptAsync(pwd, salt, KEY_LEN, { N, r: R, p: P });
  return ['scrypt', N, R, P, salt.toString('hex'), derived.toString('hex')].join('$');
}

/**
 * 校验密码
 * @param {string} plain  用户输入的明文密码
 * @param {string} stored 数据库中存的那串哈希
 * @returns {Promise<boolean>} 是否匹配
 */
export async function verifyPassword(plain, stored) {
  const pwd = String(plain || '');
  const s = String(stored || '');
  if (!pwd || !s) return false;

  const parts = s.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!n || !r || !p) return false;

  let salt;
  let expected;
  try {
    salt = Buffer.from(parts[4], 'hex');
    expected = Buffer.from(parts[5], 'hex');
  } catch (e) {
    return false;
  }
  if (!salt.length || !expected.length) return false;

  try {
    const derived = await scryptAsync(pwd, salt, expected.length, { N: n, r, p });
    // 定时安全比较：避免通过响应时间差反推密码
    return crypto.timingSafeEqual(derived, expected);
  } catch (e) {
    return false;
  }
}

export default { hashPassword, verifyPassword };

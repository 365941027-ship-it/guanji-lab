// 观己实验室 · 账号接口
//   POST /api/auth/register  注册并自动登录
//   POST /api/auth/login     登录
//   POST /api/auth/logout    登出
//
// 会话机制：登录成功后服务端在 sessions 表写入一条记录，并把随机 token
// 通过 httpOnly Cookie 交给浏览器。前端 JS 读不到这个 Cookie（防 XSS 窃取），
// 服务端也随时可以删记录让会话立即失效。
import { createUser, findByEmail } from '../lib/repos/userRepo.js';
import { createSession, deleteSession, findValidSession } from '../lib/repos/sessionRepo.js';
import { findById } from '../lib/repos/userRepo.js';
import { hashPassword, verifyPassword } from '../lib/password.js';

export const COOKIE_NAME = 'guanji_session';
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;   // 7 天，与 sessionRepo.SESSION_DAYS 保持一致

// ---------- 小工具 ----------

/** 统一错误响应格式：{ error: "..." } */
function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

/** 解析 Cookie 头 */
function parseCookies(req) {
  const out = {};
  const raw = String((req.headers && req.headers.cookie) || '');
  if (!raw) return out;
  raw.split(';').forEach((pair) => {
    const i = pair.indexOf('=');
    if (i < 0) return;
    const k = pair.slice(0, i).trim();
    const v = pair.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

/** 判断当前请求是否走 HTTPS（HTTPS 下才允许给 Cookie 加 Secure） */
function isSecureRequest(req) {
  if (process.env.COOKIE_SECURE === '0') return false;
  if (process.env.COOKIE_SECURE === '1') return true;
  const proto = String((req.headers && req.headers['x-forwarded-proto']) || '').split(',')[0].trim();
  return proto === 'https';
}

/** 生成设置 Cookie 的响应头 */
function buildSetCookie(req, token) {
  const parts = [
    COOKIE_NAME + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=' + MAX_AGE_SECONDS
  ];
  if (isSecureRequest(req)) parts.push('Secure');
  return parts.join('; ');
}

/** 生成清除 Cookie 的响应头（Max-Age=0 让浏览器立即丢弃） */
function buildClearCookie(req) {
  const parts = [
    COOKIE_NAME + '=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0'
  ];
  if (isSecureRequest(req)) parts.push('Secure');
  return parts.join('; ');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function readBody(req) {
  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  return b || {};
}

/** 只把安全字段返回给前端，绝不包含 password_hash */
function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    nickname: u.nickname || '',
    createdAt: u.created_at || u.createdAt || null
  };
}

// ---------- 供其他接口复用的鉴权helper ----------

/**
 * 从 Cookie 中取出当前登录用户
 * @param {object} req
 * @returns {Promise<object|null>} 用户对象（不含密码哈希）；未登录返回 null
 */
export async function getCurrentUser(req) {
  // 优先用 server.js 统一解析好的 req.sessionToken，避免每个接口重复解析 Cookie
  const token = req.sessionToken || parseCookies(req)[COOKIE_NAME];
  if (!token) return null;
  const session = await findValidSession(token);
  if (!session) return null;
  const user = await findById(session.user_id);
  if (!user) return null;
  // 顺便把 token 挂到 req 上，登出时能直接拿到
  req._sessionToken = token;
  return user;
}

/** 从请求里取 session token（登出用） */
export function getSessionToken(req) {
  return req.sessionToken || parseCookies(req)[COOKIE_NAME] || '';
}

// ---------- 三个接口 ----------

async function handleRegister(req, res) {
  const body = readBody(req);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const nickname = body.nickname ? String(body.nickname).trim().slice(0, 40) : '';

  if (!isValidEmail(email)) return fail(res, 400, '请输入正确的邮箱地址');
  if (password.length < 8) return fail(res, 400, '密码至少 8 位');
  if (password.length > 200) return fail(res, 400, '密码过长');

  const existing = await findByEmail(email);
  if (existing) return fail(res, 409, '该邮箱已注册，请直接登录');

  const passwordHash = await hashPassword(password);
  const user = await createUser(email, passwordHash, nickname || null);
  if (!user) return fail(res, 500, '注册失败，请稍后重试');

  // 注册成功后直接登录，省掉一次手动输入
  const token = await createSession(user.id);
  res.setHeader('Set-Cookie', buildSetCookie(req, token));
  return res.status(200).json({ ok: true, user: publicUser(user) });
}

async function handleLogin(req, res) {
  const body = readBody(req);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) return fail(res, 400, '请输入邮箱和密码');

  const found = await findByEmail(email);
  // 邮箱不存在与密码错误返回同一句提示，避免被人用来探测「哪些邮箱已注册」
  if (!found) return fail(res, 401, '邮箱或密码不正确');

  const ok = await verifyPassword(password, found.password_hash);
  if (!ok) return fail(res, 401, '邮箱或密码不正确');

  const token = await createSession(found.id);
  res.setHeader('Set-Cookie', buildSetCookie(req, token));
  return res.status(200).json({ ok: true, user: publicUser(found) });
}

async function handleLogout(req, res) {
  const token = getSessionToken(req);
  if (token) {
    try { await deleteSession(token); } catch (e) {}
  }
  res.setHeader('Set-Cookie', buildClearCookie(req));
  return res.status(200).json({ ok: true });
}

// ---------- 入口：按「方法 + 路径」分发 ----------

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '');   // 容忍结尾斜杠

  if (req.method !== 'POST') {
    return fail(res, 405, '该接口仅支持 POST');
  }

  try {
    if (path.endsWith('/api/auth/register')) return await handleRegister(req, res);
    if (path.endsWith('/api/auth/login')) return await handleLogin(req, res);
    if (path.endsWith('/api/auth/logout')) return await handleLogout(req, res);
  } catch (e) {
    // 数据库不可用等未预期错误：记录日志，但不把内部细节暴露给前端
    console.error('[auth] 处理失败：', e && e.message ? e.message : e);
    return fail(res, 500, '服务暂时不可用，请稍后重试');
  }

  return fail(res, 404, '接口不存在');
}

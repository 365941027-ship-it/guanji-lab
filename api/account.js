// 观己实验室 · 账号档案接口
//   GET  /api/account/profile  读取当前登录用户的档案
//   POST /api/account/profile  更新当前登录用户的档案
//
// 鉴权：复用 api/auth.js 的 getCurrentUser —— 它从 httpOnly Cookie 里取出 token，
// 查 sessions 表确认未过期，再取出对应用户。未登录一律返回 401。
// 用户只能读写自己的档案：user_id 只来自会话，绝不接受前端传入，避免越权改他人数据。
import { getCurrentUser } from './auth.js';
import { getProfile, upsertProfile, PROFILE_FIELDS } from '../lib/repos/profileRepo.js';

/** 统一错误响应格式：{ error: "..." } */
function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

function readBody(req) {
  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  return b || {};
}

/**
 * 只保留白名单内的字段，丢弃前端可能夹带的其他内容。
 * 这样即使前端被篡改、多传了 user_id 之类的键，也不会写进数据库。
 */
function pickAllowedFields(data) {
  const out = {};
  if (!data || typeof data !== 'object') return out;
  PROFILE_FIELDS.all.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(data, k)) out[k] = data[k];
  });
  return out;
}

// ---------- GET：读取档案 ----------

async function handleGet(req, res) {
  const user = await getCurrentUser(req);
  if (!user) return fail(res, 401, '请先登录');

  const profile = await getProfile(user.id);
  // 从未填过档案的新用户返回空对象而不是 null，
  // 前端拿到 {} 可以直接渲染表单，不用额外判空。
  return res.status(200).json({
    ok: true,
    userId: user.id,
    profile: profile || {}
  });
}

// ---------- POST：更新档案 ----------

async function handlePost(req, res) {
  const user = await getCurrentUser(req);
  if (!user) return fail(res, 401, '请先登录');

  const body = readBody(req);
  // 兼容两种传法：直接传字段，或包一层 { profile: {...} }
  const raw = (body && typeof body.profile === 'object' && body.profile !== null) ? body.profile : body;
  const data = pickAllowedFields(raw);

  if (!Object.keys(data).length) {
    return fail(res, 400, '没有收到可保存的档案内容');
  }

  // merge 默认为 true：只覆盖本次传的字段，其余保持原值。
  // 前端若要整份替换，可传 { replace: true }。
  const merge = !(body && body.replace === true);
  const saved = await upsertProfile(user.id, data, { merge });

  return res.status(200).json({
    ok: true,
    userId: user.id,
    profile: saved || {}
  });
}

// ---------- 入口：按方法分发 ----------

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '');   // 容忍结尾斜杠

  if (!path.endsWith('/api/account/profile')) {
    return fail(res, 404, '接口不存在');
  }

  try {
    if (req.method === 'GET') return await handleGet(req, res);
    if (req.method === 'POST') return await handlePost(req, res);
    return fail(res, 405, '该接口仅支持 GET 与 POST');
  } catch (e) {
    // 数据库不可用等未预期错误：记录日志，不把内部细节暴露给前端
    console.error('[account] 处理失败：', e && e.message ? e.message : e);
    return fail(res, 500, '服务暂时不可用，请稍后重试');
  }
}

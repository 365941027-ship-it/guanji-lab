// 观己实验室 · 订单核对路由
//   POST /api/order/webhook?token=…  ← 金数据「数据推送」付款成功回调
//   GET  /api/order/webhook?token=…&email=…&quiz=…  ← 手动补记一笔（备用手段）
//   GET  /api/order/status           ← 前端轮询，命中后自动解锁（需登录）
//   GET  /api/order/list?token=…     ← 站长工具：看已记账订单与注册用户（需密钥）
//
// 【安全边界】这是「谁付了钱」的唯一入口，必须防住两件事：
//
//   1. 伪造付款。过去这个接口完全开放，任何人只要知道地址，POST 一条
//      “已付款”就能白拿付费解读。现在必须带 GUAN_ORDER_TOKEN（放在推送
//      地址的查询参数里，或 x-guan-token 请求头）。没配置密钥时**一律拒绝**，
//      宁可拒真、不可放假——拒了会肉眼可见（用户反馈解不开、日志有记录），
//      放了假则无声无息，等于收入直接漏掉。
//
//   2. 查询他人付款记录。过去 status 接口只凭 URL 里的 email 就返回结果，
//      相当于可以拿别人的邮箱来问「他付过钱没有」。现在要求必须登录，
//      并且只查当前登录账号自己的记录，URL 里的 email 不再被采信。
import crypto from 'node:crypto';
import { getCurrentUser } from './auth.js';
import { recordOrder, queryOrder, listOrders } from '../lib/orderStore.js';
import { listUsers } from '../lib/repos/userRepo.js';

/** 金数据推送地址里要带的共享密钥 */
function expectedToken() {
  return String(process.env.GUAN_ORDER_TOKEN || '').trim();
}

function tokenFromRequest(req, url) {
  const fromQuery = String(url.searchParams.get('token') || '').trim();
  if (fromQuery) return fromQuery;
  const raw = req.headers['x-guan-token'];
  return String(Array.isArray(raw) ? raw[0] : (raw || '')).trim();
}

/** 定长时间比较，避免通过响应快慢猜出密钥 */
function sameToken(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  if (x.length === 0 || x.length !== y.length) return false;
  try {
    return crypto.timingSafeEqual(x, y);
  } catch (e) {
    return false;
  }
}

/** 站点标价，用于金额异常时告警（不拦截，避免金数据字段差异导致漏单） */
function configuredPrice() {
  const n = Number(process.env.GUAN_PAY_PRICE || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-guan-token');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url || '/', 'http://localhost');
  // 容忍结尾斜杠，但要求路径完全匹配——这是安全相关接口，不做模糊匹配
  const path = url.pathname.replace(/\/+$/, '');

  // ---------- 记账入口（金数据推送 / 手动补记）----------
  if ((req.method === 'POST' || req.method === 'GET') && path === '/api/order/webhook') {
    const want = expectedToken();
    if (!want) {
      console.error('[order] 拒绝记入：服务器没有配置 GUAN_ORDER_TOKEN。请在 .env 里设置后重启容器。');
      return res.status(503).json({
        error: {
          code: 'order_token_not_configured',
          message: '服务器尚未配置订单校验密钥，已拒绝记入'
        }
      });
    }
    if (!sameToken(tokenFromRequest(req, url), want)) {
      console.warn('[order] 拒绝记入：校验密钥不匹配（可能是伪造请求，或金数据推送地址少了 token 参数）');
      return res.status(403).json({ error: { code: 'bad_token', message: '校验失败' } });
    }

    // GET 是给站长留的「手动补一笔」后路：万一金数据推送没配上，
    // 用户在页面上解锁不了，可以直接用浏览器打开带参数的网址补记，
    // 不必等开发处理。同样受 token 保护。
    let body;
    if (req.method === 'GET') {
      body = {
        email: url.searchParams.get('email') || '',
        quiz: url.searchParams.get('quiz') || '',
        order_no: url.searchParams.get('orderNo') || url.searchParams.get('order_no') || 'manual',
        amount: url.searchParams.get('amount') || '',
        // 标记来源，站长工具里能一眼分清「手动补的」和「金数据自动回执的」
        event: 'manual'
      };
    } else {
      body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
    }
    const result = recordOrder(body || {});

    // 金额只告警、不拦截：金数据不同表单的字段名不完全一致，
    // 一旦字段没对上就拦，会导致「用户付了钱但解不开」这种更糟的结果。
    if (result.recorded) {
      const price = configuredPrice();
      const paid = Number(result.amount || 0);
      if (price > 0 && !paid) {
        console.warn('[order] 已记账，但推送里没有金额字段，无法核对金额：', result.key);
      } else if (price > 0 && paid + 0.001 < price) {
        console.warn(`[order] 已记账，但金额 ${paid} 低于标价 ${price}，请留意：`, result.key);
      }
      console.log('[order] 已记账：', result.key, '金额=' + (paid || '未知'));
    } else {
      // 解析不到邮箱或测试名时，把原始字段结构打到日志里。
      // 金数据不同表单的字段命名差别很大，首次接线基本都要靠这条日志来对齐；
      // 日志只存在你自己的服务器上。顶层键名单独列一份，便于快速看出字段标识。
      const raw = JSON.stringify(body || {});
      const topKeys = Object.keys(body || {}).join(', ');
      console.warn('[order] 已拒绝：推送里没认出邮箱或测试名。');
      console.warn('[order]   顶层字段：' + (topKeys || '(空)'));
      console.warn('[order]   完整内容：' + raw.slice(0, 2000));
    }
    return res.status(200).json({ ok: true, ...result });
  }

  // ---------- 前端轮询：只查当前登录账号自己的记录 ----------
  if (req.method === 'GET' && path === '/api/order/status') {
    const user = await getCurrentUser(req);
    if (!user || !user.email) {
      return res.status(401).json({ error: { code: 'login_required', message: '请先登录' } });
    }
    const quiz = String(url.searchParams.get('quiz') || '').trim();
    return res.status(200).json({ ok: true, ...queryOrder(user.email, quiz) });
  }

  // ---------- 站长工具：查看已记账订单与最近注册的用户 ----------
  // 需要同一串密钥；用于手动补记时挑对账号，以及确认补记有没有生效。
  if (req.method === 'GET' && path === '/api/order/list') {
    const want = expectedToken();
    if (!want) {
      return res.status(503).json({ error: { code: 'order_token_not_configured', message: '服务器尚未配置订单校验密钥' } });
    }
    if (!sameToken(tokenFromRequest(req, url), want)) {
      return res.status(403).json({ error: { code: 'bad_token', message: '校验失败' } });
    }
    let users = [];
    try {
      users = await listUsers(200);
    } catch (e) {
      // 数据库暂时不可用时，订单列表仍应能看，不要让整个工具挂掉
      console.warn('[order] 读取用户列表失败：', e && e.message);
    }
    return res.status(200).json({
      ok: true,
      orders: listOrders(200),
      users: users.map((u) => ({
        email: u.email || '',
        nickname: u.nickname || '',
        createdAt: u.created_at || null
      }))
    });
  }

  return res.status(405).json({ error: { code: 'method_not_allowed' } });
}

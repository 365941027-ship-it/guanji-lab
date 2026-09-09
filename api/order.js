// 观己实验室 · 订单自动核对路由
// POST /api/order/webhook  ← 金数据「数据推送」付款成功回调
// GET  /api/order/status?email=&quiz=  ← 前端轮询，命中后自动解锁

import { recordOrder, queryOrder } from '../lib/orderStore.js';

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url || '/', 'http://localhost');

  // 金数据推送（POST JSON）
  if (req.method === 'POST' && url.pathname.endsWith('/webhook')) {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const result = recordOrder(body || {});
    return res.status(200).json({ ok: true, ...result });
  }

  // 前端轮询
  if (req.method === 'GET' && url.pathname.endsWith('/status')) {
    const email = String(url.searchParams.get('email') || '').trim();
    const quiz = String(url.searchParams.get('quiz') || '').trim();
    return res.status(200).json({ ok: true, ...queryOrder(email, quiz) });
  }

  return res.status(405).json({ error: { code: 'method_not_allowed' } });
}

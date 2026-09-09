// 观己实验室 · 自查刷新时间戳接口
// 前端在“用户完成测试或人生设计”后调用一次，后端自动更新 lastSelfCheckUpdate；
// 下次打开“我的专属自查”时，/api/chat?pageType=mirror 会据此强制重新生成问题。

import { getSelfCheck, touchSelfCheck } from '../lib/selfCheckStore.js';

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  let userId = '';
  let source = '';
  if (req.method === 'POST') {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})) || {};
    userId = String(body.userId || body.email || '').trim();
    source = String(body.source || req.query.source || '').trim();
  } else if (req.method === 'GET') {
    userId = String(req.query.userId || req.query.email || '').trim();
    source = String(req.query.source || '').trim();
  } else {
    return res.status(405).json({ error: { code: 'method_not_allowed' } });
  }

  if (!userId) {
    return res.status(200).json({ ok: true, configured: false, message: '未传 userId，无法记录刷新时间' });
  }

  const rec = touchSelfCheck(userId, source);
  return res.status(200).json({
    ok: true,
    configured: true,
    userId,
    lastSelfCheckUpdate: rec ? rec.lastSelfCheckUpdate : null,
    forceRegenerateNextMirror: true
  });
}

// 观己实验室 · 自查刷新时间戳接口
// 前端在“用户完成测试或人生设计”后调用一次，后端自动更新 lastSelfCheckUpdate；
// 下次打开“我的专属自查”时，/api/chat?pageType=mirror 会据此强制重新生成问题。
//
// 【信任边界】本文件不信任前端传入的 userId / email。
//   用户身份来自会话（server.js 解析 Cookie → getCurrentUser 查 sessions 表），
//   未登录一律返回 401。数据写入 user_agent_state.last_self_check_update。

import { touchSelfCheck } from '../lib/selfCheckStore.js';
import { getCurrentUser } from './auth.js';

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  let source = '';
  if (req.method === 'POST') {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})) || {};
    source = String(body.source || req.query.source || '').trim();
  } else if (req.method === 'GET') {
    source = String(req.query.source || '').trim();
  } else {
    return res.status(405).json({ error: { code: 'method_not_allowed' } });
  }

  let currentUser;
  try {
    currentUser = await getCurrentUser(req);
  } catch (e) {
    console.error('[selfcheck] 会话校验失败：', e && e.message ? e.message : e);
    return res.status(500).json({ error: '服务暂时不可用，请稍后重试' });
  }
  if (!currentUser) return res.status(401).json({ error: '请先登录' });

  const rec = await touchSelfCheck(currentUser.id, source);
  return res.status(200).json({
    ok: true,
    configured: true,
    userId: currentUser.id,
    lastSelfCheckUpdate: rec ? rec.lastSelfCheckUpdate : null,
    forceRegenerateNextMirror: true
  });
}

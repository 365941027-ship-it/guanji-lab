// 观己实验室 · 分享解锁验证接口（V1）
// 用于记录「朋友是否打开了分享链接」，支持前端「分享解锁」校验。
// 环境变量：
//   SUPABASE_URL              形如 https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY Project Settings → API → service_role（勿泄露到前端）
// 未配置时接口返回 configured:false，前端自动回退到「点击即解锁」的信任制。

export default async function handler(req, res) {
  var origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.status(204).end();

  var supaUrl = process.env.SUPABASE_URL || '';
  var serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  function notConfigured(code) {
    return res.status(200).json({ configured: false, code: code || 'not_configured' });
  }

  if (!supaUrl || !serviceKey) {
    return notConfigured('env_missing');
  }

  var table = 'share_claims';
  var base = supaUrl.replace(/\/+$/, '') + '/rest/v1/' + table;
  var headers = {
    'Content-Type': 'application/json',
    'apikey': serviceKey,
    'Authorization': 'Bearer ' + serviceKey
  };

  // GET /api/claim?ref=xxx&quiz=yyy → 查询该 ref 是否已被打开
  if (req.method === 'GET') {
    var ref = req.query.ref || '';
    if (!ref) return res.status(400).json({ error: 'missing_ref' });
    try {
      var r = await fetch(base + '?ref=eq.' + encodeURIComponent(ref) + '&select=id&limit=1', { headers: headers });
      if (!r.ok) return res.status(502).json({ error: 'upstream_error', status: r.status });
      var rows = await r.json();
      return res.status(200).json({ configured: true, claimed: Array.isArray(rows) && rows.length > 0 });
    } catch (e) {
      return res.status(502).json({ error: 'proxy_error' });
    }
  }

  // POST /api/claim  body: { ref, quiz } → 登记一次打开（同一 ref 只登记一次）
  if (req.method === 'POST') {
    var body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch (e) {
      return res.status(400).json({ error: 'bad_request' });
    }
    var postRef = body.ref || '';
    var postQuiz = body.quiz || '';
    if (!postRef) return res.status(400).json({ error: 'missing_ref' });
    try {
      var check = await fetch(base + '?ref=eq.' + encodeURIComponent(postRef) + '&select=id&limit=1', { headers: headers });
      var existing = check.ok ? await check.json() : [];
      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(200).json({ configured: true, recorded: false, already: true });
      }
      var insert = await fetch(base, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ ref: postRef, quiz_key: postQuiz || '', created_at: new Date().toISOString() })
      });
      if (!insert.ok) return res.status(502).json({ error: 'upstream_error', status: insert.status });
      return res.status(200).json({ configured: true, recorded: true });
    } catch (e) {
      return res.status(502).json({ error: 'proxy_error' });
    }
  }

  return res.status(405).json({ error: 'method_not_allowed' });
}

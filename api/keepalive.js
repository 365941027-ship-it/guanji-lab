// 观己实验室 · Supabase 保活中转
// GitHub Actions 无法直接解析 supabase.co，因此改由本接口代为 ping。
// Vercel 网络可正常访问 Supabase；每次调用都会向项目 API 发一次真实请求。

const REF = 'npsmpxfpxjhspymnxrrv';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wc21weGZweGpoc3B5bW54cnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNjI1MTIsImV4cCI6MjEwMjkzODUxMn0.9agyMYWqh6tkIrTfIs4OJgd4dvQeSuoHUJqPi954Toc';

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const base = 'https://' + REF + '.supabase.co';
  const headers = { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY };
  const results = {};

  try {
    const r = await fetch(base + '/rest/v1/profiles?select=id&limit=1', { headers });
    results.rest = r.status;
  } catch (e) {
    results.rest = 'ERR:' + (e && e.cause && e.cause.message ? e.cause.message : (e && e.message ? e.message : 'unknown'));
  }
  try {
    const a = await fetch(base + '/auth/v1/health', { headers });
    results.auth = a.status;
  } catch (e) {
    results.auth = 'ERR:' + (e && e.cause && e.cause.message ? e.cause.message : (e && e.message ? e.message : 'unknown'));
  }

  return res.status(200).json({ ok: true, at: new Date().toISOString(), results });
}

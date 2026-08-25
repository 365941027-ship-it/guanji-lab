// 观己实验室 · 服务端模型代理（Vercel Serverless Function）
// 部署说明见 DEPLOY_PROXY.md
// 环境变量：
//   DEEPSEEK_API_KEY（主通道，必填）
//   可选：OPENAI_API_KEY、GEMINI_API_KEY

const PROVIDERS = {
  deepseek: {
    url: 'https://api.deepseek.com/chat/completions',
    env: 'DEEPSEEK_API_KEY',
    headers: function (key) { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }; },
    build: function (messages, maxTokens, temperature) {
      return { model: 'deepseek-v4-pro', messages: messages, max_tokens: maxTokens, temperature: temperature };
    },
    parse: function (data) {
      return data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    }
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    env: 'OPENAI_API_KEY',
    headers: function (key) { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }; },
    build: function (messages, maxTokens, temperature) {
      return { model: 'gpt-4o-mini', messages: messages, max_tokens: maxTokens, temperature: temperature };
    },
    parse: function (data) {
      return data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    }
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    env: 'GEMINI_API_KEY',
    headers: function () { return { 'Content-Type': 'application/json' }; },
    urlKey: function (key) { return '?key=' + encodeURIComponent(key); },
    build: function (messages, maxTokens, temperature) {
      var sys = '';
      var user = '';
      messages.forEach(function (m) {
        if (m.role === 'system') sys += (sys ? '\n\n' : '') + m.content;
        if (m.role === 'user') user += (user ? '\n\n' : '') + m.content;
      });
      return {
        contents: [{ role: 'user', parts: [{ text: (sys ? sys + '\n\n以下是用户的回答：\n' : '') + user }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: temperature }
      };
    },
    parse: function (data) {
      return data && data.candidates && data.candidates[0] && data.candidates[0].content &&
        data.candidates[0].content.parts && data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
    }
  }
};

export default async function handler(req, res) {
  // 只允许本站与本地调试调用，禁止任意站点白嫖解读通道
  var ALLOWED_ORIGINS = {
    'https://guanji-lab.vercel.app': true,
    'https://365941027-ship-it.github.io': true,
    'http://localhost:8777': true,
    'http://127.0.0.1:8777': true,
    'null': true // 无来源（同源/隐私模式）放行，仍受限流保护
  };
  var origin = req.headers.origin || 'null';
  if (!ALLOWED_ORIGINS[origin]) {
    return res.status(403).json({ error: { code: 'origin_forbidden', message: '来源不被允许' } });
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 简单内存限流：每 IP 每小时最多 30 次解读（Vercel 无状态实例，按实例内存计，
  // 用于挡住最基础的滥用；正式运营建议升级为 Upstash/Vercel KV 限流）
  var RATE_WINDOW_MS = 60 * 60 * 1000;
  var RATE_MAX = 30;
  var rateStore = globalThis.__GUAN_RATE__ || (globalThis.__GUAN_RATE__ = {});
  function clientIp() {
    return String(
      (req.headers['x-forwarded-for'] || '').split(',')[0] ||
      req.headers['x-real-ip'] ||
      'unknown'
    ).trim();
  }
  function rateLimited() {
    var ip = clientIp();
    var now = Date.now();
    var rec = rateStore[ip];
    if (!rec || now - rec.start > RATE_WINDOW_MS) {
      rateStore[ip] = { start: now, count: 1 };
      return false;
    }
    rec.count += 1;
    return rec.count > RATE_MAX;
  }

  if (req.method === 'OPTIONS') return res.status(204).end();

  // 健康检查：前端用来显示“内置通道”连接状态
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      provider: 'deepseek',
      ready: !!process.env.DEEPSEEK_API_KEY
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'method_not_allowed', message: '仅支持 POST' } });
  }

  if (rateLimited()) {
    return res.status(429).json({ error: { code: 'rate_limited', message: '请求过于频繁，请稍后再试' } });
  }

  var body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: { code: 'bad_request', message: '请求格式不正确' } });
  }

  var provider = String(body.provider || 'deepseek').toLowerCase();
  var cfg = PROVIDERS[provider];
  if (!cfg) {
    return res.status(400).json({ error: { code: 'unknown_provider', message: '未知的模型通道' } });
  }

  var key = process.env[cfg.env];
  if (!key) {
    return res.status(501).json({
      error: { code: 'no_server_key', message: '服务端尚未配置模型密钥，请先联系网站管理者' }
    });
  }

  var messages = Array.isArray(body.messages) ? body.messages.slice(0, 40) : [];
  if (!messages.length) {
    return res.status(400).json({ error: { code: 'empty_messages', message: '没有收到需要解读的内容' } });
  }

  var maxTokens = Math.min(Math.max(Number(body.max_tokens) || 1200, 100), 5000);
  var temperature = typeof body.temperature === 'number' ? body.temperature : 0.8;

  try {
    var url = cfg.url + (cfg.urlKey ? cfg.urlKey(key) : '');
    var upstream = await fetch(url, {
      method: 'POST',
      headers: cfg.headers(key),
      body: JSON.stringify(cfg.build(messages, maxTokens, temperature))
    });
    var data = await upstream.json().catch(function () { return {}; });
    if (!upstream.ok) {
      var msg = (data && data.error && data.error.message) || ('上游模型服务失败（' + upstream.status + '）');
      return res.status(502).json({ error: { code: 'upstream_error', message: msg } });
    }
    var text = cfg.parse(data);
    if (!text) {
      return res.status(502).json({ error: { code: 'empty_upstream', message: '模型没有返回内容，请重试' } });
    }
    return res.status(200).json({ text: text.trim() });
  } catch (e) {
    return res.status(502).json({ error: { code: 'proxy_error', message: '解读通道暂时不可用，请稍后重试' } });
  }
}

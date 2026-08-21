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
  var origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

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

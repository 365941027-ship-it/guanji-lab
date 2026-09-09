// 观己实验室 · 统一模型调用客户端（供 /api/chat 多 Agent 路由使用）
const PROVIDERS = {
  deepseek: {
    url: 'https://api.deepseek.com/chat/completions',
    env: 'DEEPSEEK_API_KEY',
    headers: (key) => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }),
    build: (messages, maxTokens, temperature, reasoningEffort) => ({
      model: 'deepseek-v4-pro',
      messages,
      max_tokens: maxTokens,
      temperature,
      reasoning_effort: reasoningEffort || 'low'
    }),
    parse: (data) => data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    env: 'OPENAI_API_KEY',
    headers: (key) => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }),
    build: (messages, maxTokens, temperature) => ({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature
    }),
    parse: (data) => data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    env: 'GEMINI_API_KEY',
    headers: () => ({ 'Content-Type': 'application/json' }),
    urlKey: (key) => '?key=' + encodeURIComponent(key),
    build: (messages, maxTokens, temperature) => {
      let sys = '';
      let user = '';
      (messages || []).forEach((m) => {
        if (m.role === 'system') sys += (sys ? '\n\n' : '') + m.content;
        if (m.role === 'user') user += (user ? '\n\n' : '') + m.content;
      });
      return {
        contents: [{ role: 'user', parts: [{ text: (sys ? sys + '\n\n以下是用户内容：\n' : '') + user }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature }
      };
    },
    parse: (data) => data && data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts.map((p) => p.text || '').join('')
  }
};

export function resolveProvider(name) {
  return PROVIDERS[name || 'deepseek'];
}

export async function callModel({ provider = 'deepseek', messages = [], maxTokens = 2000, temperature = 0.8, reasoningEffort = 'low' } = {}) {
  const cfg = PROVIDERS[provider] || PROVIDERS.deepseek;
  const key = process.env[cfg.env];
  if (!key) {
    const err = new Error('服务端尚未配置 ' + cfg.env + '，请先设置模型密钥');
    err.code = 'no_server_key';
    throw err;
  }
  const url = cfg.url + (cfg.urlKey ? cfg.urlKey(key) : '');
  const upstream = await fetch(url, {
    method: 'POST',
    headers: cfg.headers(key),
    body: JSON.stringify(cfg.build(messages, maxTokens, temperature, reasoningEffort))
  });
  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    const msg = (data && data.error && data.error.message) || ('上游模型服务失败（' + upstream.status + '）');
    const err = new Error(msg);
    err.code = 'upstream_error';
    err.status = upstream.status;
    throw err;
  }
  const text = cfg.parse(data);
  if (!text) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[modelClient] empty upstream body:', JSON.stringify(data).slice(0, 800));
    }
    const err = new Error('模型没有返回内容，请重试');
    err.code = 'empty_upstream';
    throw err;
  }
  return text.trim();
}

export default callModel;

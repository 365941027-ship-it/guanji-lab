// 观己实验室 · 单机版服务入口（腾讯云/任意 Node 服务器）
// 同时提供静态页面与 /api/* 接口，替代 Vercel Serverless。
// 用法：
//   DEEPSEEK_API_KEY=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node server.js
//   默认监听 8787；可通过 PORT 环境变量修改。
import http from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import interpretHandler from './api/interpret.js';
import claimHandler from './api/claim.js';
import keepaliveHandler from './api/keepalive.js';
import configHandler from './api/config.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/[\\/]$/, '');
const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8787);
const BETA_MODE = process.env.GUAN_BETA_MODE === '1';
const BETA_CODE = String(process.env.GUAN_BETA_CODE || '');
const BETA_COOKIE = 'guan_beta';

function betaHash() {
  if (!BETA_CODE) return '';
  return createHash('sha256').update('guanji-beta:' + BETA_CODE).digest('hex');
}

function parseCookies(req) {
  const out = {};
  const raw = String(req.headers.cookie || '');
  raw.split(';').forEach((pair) => {
    const i = pair.indexOf('=');
    if (i > -1) out[pair.slice(0, i).trim()] = decodeURIComponent(pair.slice(i + 1).trim());
  });
  return out;
}

function betaAllowed(req) {
  if (!BETA_MODE) return true;
  const cookies = parseCookies(req);
  return cookies[BETA_COOKIE] === betaHash();
}

function sendBetaPage(res, errorText) {
  const errHtml = errorText
    ? '<p id="betaError" style="color:#d98a7a;margin:10px 0 0;font-size:.9rem">' + errorText + '</p>'
    : '';
  const html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex,nofollow"><title>观己实验室 · 内测版</title>' +
    '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1220;color:#e9e2d0;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;padding:20px}' +
    '.card{max-width:520px;width:100%;text-align:center;padding:44px 34px;border:1px solid rgba(224,192,126,.32);border-radius:18px;background:rgba(15,22,40,.88);box-shadow:0 18px 50px rgba(0,0,0,.35)}' +
    '.logo{width:58px;height:58px;margin:0 auto 18px;display:block;opacity:.95}' +
    'h1{font-size:1.5rem;letter-spacing:.12em;margin:0 0 8px;color:#e0c07e;font-weight:600}' +
    '.en{font-size:.72rem;letter-spacing:.3em;color:rgba(233,226,208,.5);margin-bottom:24px;text-transform:uppercase}' +
    'p{line-height:1.9;color:rgba(233,226,208,.86);font-size:.95rem;margin:0 0 14px}' +
    'form{margin-top:24px}' +
    'input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:9px;border:1px solid rgba(224,192,126,.35);background:rgba(255,255,255,.05);color:#e9e2d0;font-size:1rem;text-align:center;outline:none;letter-spacing:.15em}' +
    'button{margin-top:14px;width:100%;padding:13px;border:none;border-radius:9px;background:#e0c07e;color:#0b1220;font-size:.98rem;font-weight:600;cursor:pointer;letter-spacing:.1em}' +
    'button:hover{background:#e8cd8f}.hint{margin-top:16px;font-size:.8rem;color:rgba(233,226,208,.42)}' +
    '.steps{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;justify-content:center}' +
    '.step{flex:1;min-width:100px;font-size:.78rem;color:rgba(233,226,208,.55);border:1px solid rgba(224,192,126,.16);padding:8px;border-radius:8px}' +
    '</style></head><body><div class="card">' +
    '<img class="logo" alt="观己" src="data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 6 60 40 94 50 60 60 50 94 40 60 6 50 40 40Z" fill="none" stroke="#e0c07e" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="50" r="8" fill="#e0c07e"/></svg>') + '">' +
    '<h1>观己实验室</h1><div class="en">Self Insight Lab</div>' +
    '<p>理解自己，设计人生。<br>这里正在小范围内测，只对受邀的朋友开放。</p>' +
    '<p style="font-size:.88rem;color:rgba(233,226,208,.7)">你此刻的状态，不是你这个人。<br>欢迎进来，慢慢看自己。</p>' +
    '<div class="steps"><div class="step">① 输入内测码</div><div class="step">② 选一面镜子</div><div class="step">③ 收到一封写给你的信</div></div>' +
    '<form method="POST" action="/beta"><input type="text" name="code" placeholder="请输入内测码" autocomplete="off" required autofocus>' +
    errHtml +
    '<button type="submit">进入观己</button></form>' +
    '<div class="hint">内测版 · 尚未正式发布 · 内容持续打磨中</div>' +
    '</div></body></html>';
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow'
  });
  res.end(html);
}

function readBody(req, limitMb) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > (limitMb || 1) * 1024 * 1024) {
        reject(new Error('body_too_large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function urlDecodeForm(bodyText) {
  const out = {};
  String(bodyText || '').split('&').forEach((pair) => {
    if (!pair) return;
    const i = pair.indexOf('=');
    if (i > -1) out[decodeURIComponent(pair.slice(0, i).replace(/\+/g, ' '))] = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
  });
  return out;
}

async function handleBetaEntry(req, res, url) {
  if (url.pathname !== '/beta') return false;
  if (req.method === 'GET') {
    sendBetaPage(res, '');
    return true;
  }
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return true;
  }
  let body = '';
  try {
    body = await readBody(req, 1);
  } catch (e) {
    res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Too Large');
    return true;
  }
  const form = urlDecodeForm(body);
  const code = String(form.code || '').trim();
  if (BETA_MODE && code === BETA_CODE && betaHash()) {
    const maxAge = 60 * 60 * 24 * 30; // 30 天
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': BETA_COOKIE + '=' + betaHash() + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + maxAge
    });
    res.end();
    return true;
  }
  sendBetaPage(res, '内测码不正确，请再试一次');
  return true;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

// Vercel Function handler 兼容适配：把 Node IncomingMessage / ServerResponse
// 包装成 api/*.js 期望的 req / res 形状。
function makeApiReq(req, url, bodyText) {
  req.query = Object.fromEntries(url.searchParams.entries());
  if (bodyText) {
    const ct = String(req.headers['content-type'] || '');
    if (ct.includes('application/json')) {
      try { req.body = JSON.parse(bodyText); } catch (e) { req.body = bodyText; }
    } else {
      req.body = bodyText;
    }
  } else {
    req.body = {};
  }
  return req;
}

function makeApiRes(raw) {
  const state = { headers: {}, statusCode: 200, ended: false };
  return {
    raw,
    state,
    setHeader(k, v) { state.headers[k] = v; },
    status(code) { state.statusCode = code; return this; },
    setStatusCode(code) { state.statusCode = code; return this; },
    json(payload) {
      if (state.ended) return;
      state.ended = true;
      if (!Object.prototype.hasOwnProperty.call(state.headers, 'Content-Type')) {
        state.headers['Content-Type'] = 'application/json; charset=utf-8';
      }
      raw.writeHead(state.statusCode, state.headers);
      raw.end(JSON.stringify(payload));
    },
    end(body) {
      if (state.ended) return;
      state.ended = true;
      raw.writeHead(state.statusCode, state.headers);
      raw.end(body == null ? undefined : body);
    }
  };
}

const API_ROUTES = [
  ['/api/interpret', interpretHandler],
  ['/api/claim', claimHandler],
  ['/api/keepalive', keepaliveHandler],
  ['/api/config', configHandler]
];

async function handleApi(req, res, pathname, url) {
  const route = API_ROUTES.find((r) => r[0] === pathname);
  if (!route) return false;

  // 读取请求体（限制 1MB，防止滥用）
  let bodyText = '';
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    bodyText = await new Promise((resolve, reject) => {
      let chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > 1024 * 1024) {
          reject(new Error('body_too_large'));
          req.destroy();
          return;
        }
        chunks.push(c);
      });
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      req.on('error', reject);
    }).catch((e) => {
      res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: { code: 'body_too_large' } }));
      return null;
    });
    if (bodyText === null) return true;
  }

  const apiReq = makeApiReq(req, url, bodyText);
  const apiRes = makeApiRes(res);
  try {
    await route[1](apiReq, apiRes);
  } catch (e) {
    if (!apiRes.state.ended) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: { code: 'internal_error', message: String(e && e.message || e) } }));
    }
  }
  return true;
}

async function safeFile(fullPath) {
  const normalized = normalize(fullPath);
  if (!normalized.startsWith(ROOT + sep) && normalized !== ROOT) return null;
  try {
    const s = await stat(normalized);
    return s.isFile() ? normalized : null;
  } catch (e) {
    return null;
  }
}

async function serveStatic(res, urlPath) {
  const decoded = decodeURIComponent(urlPath);
  let rel = decoded.replace(/^\/+/, '');
  if (rel === '') rel = 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';

  const direct = join(ROOT, rel);
  let file = await safeFile(direct);
  if (!file && !extname(rel)) {
    file = await safeFile(direct + '.html');
  }
  if (!file && extname(rel) === '') {
    file = await safeFile(join(direct, 'index.html'));
  }
  if (!file) {
    const notFound = await safeFile(join(ROOT, '404.html'));
    if (notFound) {
      res.writeHead(404, { 'Content-Type': MIME['.html'] || 'text/html; charset=utf-8' });
      createReadStream(notFound).pipe(res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  const isHtml = type.includes('text/html');
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=300'
  });
  createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const pathname = url.pathname;

    // 内测码入口（GET 显示 / POST 校验）
    if (pathname === '/beta') {
      await handleBetaEntry(req, res, url);
      return;
    }

    // 内测门禁：未授权时仅放行保活接口，其余页面/资源/API 一律拦截
    if (!betaAllowed(req)) {
      if (pathname.startsWith('/api/') && pathname !== '/api/keepalive') {
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: { code: 'beta_required', message: '内测版仅对受邀用户开放' } }));
        return;
      }
      if (!pathname.startsWith('/api/')) {
        sendBetaPage(res, '');
        return;
      }
    }

    if (pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, pathname, url);
      if (handled) return;
    }

    await serveStatic(res, pathname);
  } catch (e) {
    try {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    } catch (_e) {}
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[观己实验室] http://0.0.0.0:' + PORT);
});

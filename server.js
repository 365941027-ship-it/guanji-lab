// 观己实验室 · 单机版服务入口（腾讯云/任意 Node 服务器）
// 同时提供静态页面与 /api/* 接口，替代 Vercel Serverless。
// 用法：
//   DEEPSEEK_API_KEY=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node server.js
//   默认监听 8787；可通过 PORT 环境变量修改。
import http from 'node:http';
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

# 部署「内置解读通道」（免用户 API Key）

网站是 GitHub Pages 静态站，本身不能跑后端代码。为了让用户无需填写自己的 API Key 就能使用「深度解读」和「每日一问」，需要把 `api/interpret.js` 部署到一个免费的服务端托管（推荐 Vercel），并把服务端密钥放在环境变量里。

## 1. 准备

- 一个 DeepSeek API Key：到 [platform.deepseek.com](https://platform.deepseek.com) → API keys 创建，充值少量余额（按量计费，非常便宜）。
- 一个 Vercel 账号（可用 GitHub 直接登录）。

## 2. 部署代理

方式 A（推荐，命令行）：

```bash
npm i -g vercel          # 或 pnpm i -g vercel
vercel login             # 浏览器里确认
vercel link              # 关联本项目
vercel env add DEEPSEEK_API_KEY   # 粘贴你的 DeepSeek Key，选择 Production
vercel --prod
```

部署成功后，会得到一个形如 `https://你的项目.vercel.app/api/interpret` 的地址。

方式 B（网页端）：

1. 把整个项目推到 GitHub 仓库（已有：`365941027-ship-it/guanji-lab`）。
2. 打开 [vercel.com](https://vercel.com) → Add New Project → Import 该仓库。
3. Framework Preset 选 Other；Build Command 留空；Output Directory 留空。
4. 在 Environment Variables 添加 `DEEPSEEK_API_KEY`。
5. Deploy。

## 3. 让网站使用代理

编辑 `assets/js/main.js` 顶部：

```js
var GUAN_PROXY_DEFAULT = 'https://guanji-lab.vercel.app/api/interpret';
```

提交并推送，GitHub Pages 会自动更新。

> 当前已部署完成，线上地址即 `https://guanji-lab.vercel.app/api/interpret`，`DEEPSEEK_API_KEY` 已配置为生产环境变量（Sensitive）。

## 4. 验证

- 浏览器访问 `https://你的项目.vercel.app/api/interpret`，应返回 `{"ok":true,"provider":"deepseek","ready":true}`。
- 打开任一测试 → 完成 → 「✨ 深度解读」→ 不填 Key 直接生成完整解读（结果页自动展开）。

## 可选

- 如同时想支持 OpenAI / Gemini 通道，再加 `OPENAI_API_KEY` / `GEMINI_API_KEY` 环境变量即可。
- 本地调试：`python3 -m http.server 8777`，然后在浏览器控制台执行 `localStorage.setItem('guan_proxy_url','http://127.0.0.1:8787/api/interpret')`，用任意本地代理验证免 Key 流程。

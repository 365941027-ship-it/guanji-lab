# 免费公网部署指南

这个网站是纯静态站点（HTML/CSS/JS），可以部署到任何免费静态托管。三选一：

## 方式一：Vercel（推荐）

1. 打开 <https://vercel.com> 注册/登录（可用 GitHub 账号直接登录）
2. 安装 CLI 或在网页上导入项目：
   - CLI：`npm i -g vercel`，然后在项目目录运行 `vercel`
   - 网页：New Project → 导入本目录 → Deploy
3. 部署完成后会得到 `https://<项目名>.vercel.app`

## 方式二：Netlify

1. 打开 <https://app.netlify.com> 登录
2. Sites → Add new site → Deploy manually → 拖入本目录文件夹
3. 完成，得到 `https://<随机名>.netlify.app`

## 方式三：GitHub Pages

1. 新建 GitHub 仓库，把本项目推上去（`git init && git add . && git commit -m "init"`，然后 `git remote add origin <repo>` + `git push`）
2. 仓库 Settings → Pages → Source 选 `main` 分支
3. 访问 `https://<用户名>.github.io/<仓库名>/`

## 分享给朋友

部署后把公网地址发给朋友即可，无需同一 Wi-Fi，任何设备可访问。

## 关于账号系统

当前账号系统是纯本地演示（数据存浏览器）。要让朋友的数据真正独立且跨设备，需要后端：
- 用 Vercel/Netlify 的 Serverless 函数 + 数据库（如 Supabase/Neon）
- 或部署一个小型 Node 后端（Express + SQLite/Postgres）
- 前端 `account.js` 已预留命名空间结构，接后端时只需把 `localStorage` 换成 API 调用

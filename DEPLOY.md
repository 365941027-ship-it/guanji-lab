# 部署说明（当前状态）

## 现在线上跑在哪里

「观己实验室」是**一套带后端的完整站点**，不是纯静态页：

- 静态页面（HTML/CSS/JS）+ 接口（`/api/*`）+ 数据库，都在**腾讯云轻量服务器**上，用 Docker 跑。
- 对外地址：`http://162.14.105.122:8787`（内测期为内测码进入制）。
- 部署与更新步骤：见 [deploy/README.md](deploy/README.md)。

> 注意：`http://IP:端口` 这种地址在微信里点开可能被拦，属于正常现象。正式对外分享建议先完成域名备案，再绑定域名。

## 为什么不再用免费静态托管

早期版本是纯静态站，可以放在 Vercel / Netlify / GitHub Pages 上。现在不行了，因为下面这些能力都需要服务端：

| 能力 | 需要什么 | 静态托管能做吗 |
| --- | --- | --- |
| 注册 / 登录 / 换设备找回档案 | 账号系统 + 数据库 | ❌ |
| 测试解读、人生设计、模拟推演 | 服务端持有模型密钥并调用模型 | ❌ |
| 内测门禁、付费墙、订单核验 | 服务端校验 | ❌ |
| 只看页面、本地记录 | 静态文件即可 | ✅ |

把模型密钥放在纯静态站里会直接暴露给任何人，所以「前端直连模型」这条路不可行。

## GitHub Pages 那份怎么处理

仓库里仍然保留 GitHub Pages 部署，它现在只做一件事：**把访客跳转到服务器地址**。

实现是 `assets/js/host-redirect.js`，它在 `<head>` 里最先执行，并从路径里剥掉 `/guanji-lab` 前缀，所以：

```
https://<用户名>.github.io/guanji-lab/profile.html
   → http://162.14.105.122:8787/profile.html
```

已删除的 Vercel 那份是更早期的副本（早于该脚本），所以它自己不会跳转，后台删除后老链接会直接失效——如果之前把 `guanji-lab.vercel.app` 的链接发给过别人，那些链接就不再可用。

## 换域名 / 加 HTTPS

1. 买域名并完成 ICP 备案（大陆服务器对外提供服务需要备案）。
2. 用 Nginx 或 Caddy 把 80 / 443 反向代理到 `127.0.0.1:8787`。
3. 改两处地址常量：
   - `assets/js/host-redirect.js` 里的 `CANONICAL_ORIGIN`
   - `api/chat.js`、`api/interpret.js`、`api/simulate.js` 的 `ALLOWED_ORIGINS` 白名单
4. 重新构建并重启容器（见 [deploy/README.md](deploy/README.md)）。

## 相关文档

- 服务器部署与更新：[deploy/README.md](deploy/README.md)
- 商业化与定价：[MONETIZATION_PLAN.md](MONETIZATION_PLAN.md)
- 多 Agent 架构：[AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md)

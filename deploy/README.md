# 观己实验室 · 腾讯轻量云部署（与盯盘软件同机）

## 为什么可以同机

「观己」是纯静态站 + 4 个轻量 Node 接口：

- `/api/interpret` 深度解读（转发 DeepSeek，需密钥）
- `/api/claim` 分享解锁验证（写 Supabase）
- `/api/keepalive` Supabase 保活（替代 GitHub runner 直连）
- `/api/config` 站点级付费配置

A股盯盘服务占用 `8235`，观己容器默认占用 `8787`，CPU / 内存压力都很小，2 核 2G 足够。

## 部署步骤

1. 把仓库上传到服务器 `/opt/guanji-lab`：

   ```bash
   rsync -av --exclude .git "/Users/yexiyan/Documents/塔罗玄学 心灵疗愈/" root@服务器IP:/opt/guanji-lab/
   ```

2. 首次运行安装脚本（会生成 `.env` 并提示填入密钥）：

   ```bash
   cd /opt/guanji-lab && sudo bash deploy/install_guanji_docker.sh
   ```

3. 编辑 `/opt/guanji-lab/.env`：

   - `DEEPSEEK_API_KEY`：DeepSeek Key（解读通道）
   - `SUPABASE_SERVICE_ROLE_KEY`：Supabase 后台 service role（勿外泄）
   - `GUAN_PAY_ENABLED=1` 并填入面包多商品 JSON 后，付费墙自动对所有访客生效

4. 再次运行安装脚本构建并启动，然后在腾讯云轻量控制台 → 防火墙放行 TCP 8787。

5. 访问 `http://服务器IP:8787` 验证；手机浏览器直接打开同一地址即可测试。

## 前端如何选择接口

`assets/js/main.js` 会自动判断：在 GitHub Pages / Vercel / 本地调试访问时仍走原 Vercel 接口；在 IP 或自建域名访问时自动改走同源 `/api/*`，无需改代码。

## 关于 HTTPS / 域名

大陆服务器对外提供服务需要域名 ICP 备案，备案期间可用 `http://IP:8787` 做小范围测试。备案通过后，再用 Nginx / Caddy 反代 80/443 到 8787。

## 更新

```bash
rsync -av --exclude .git "/Users/yexiyan/Documents/塔罗玄学 心灵疗愈/" root@服务器IP:/opt/guanji-lab/
cd /opt/guanji-lab && sudo bash deploy/install_guanji_docker.sh
```

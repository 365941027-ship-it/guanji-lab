# 观己实验室 · 腾讯轻量云部署（与盯盘软件同机）

## 为什么可以同机

「观己」是静态页面 + 一组轻量 Node 接口：

- `/api/interpret` 深度解读（转发 DeepSeek，需密钥）
- `/api/chat` 多角色调度（测试解读 / 人生设计 / 模拟 / 自查）
- `/api/auth/*` 注册登录登出（写自建 PostgreSQL）
- `/api/account/profile` 用户档案读写
- `/api/config` 站点级付费配置

A股盯盘服务占用 `8235`，观己容器占用 `8787`，数据库容器 `guanji-postgres` 限制在 256MB。
CPU / 内存压力都很小，2 核 2G 足够。

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
   - `DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASSWORD`：自建 PostgreSQL 连接信息（账号与档案用）
   - `GUAN_BETA_MODE=1` + `GUAN_BETA_CODE=...`：内测门禁
   - `GUAN_PAY_ENABLED=1` 并填入收款链接 JSON 后，付费墙自动对所有访客生效

   各变量的完整说明见 `deploy/.env.example`。

4. 再次运行安装脚本构建并启动，然后在腾讯云轻量控制台 → 防火墙放行 TCP 8787。

5. 访问 `http://服务器IP:8787` 验证；手机浏览器直接打开同一地址即可测试。

## 前端如何选择接口

所有接口都走**同源** `/api/*`，由本容器提供，无需配置跨域。

GitHub Pages 那份镜像已改为自动跳转到本服务器（`assets/js/host-redirect.js`），
所以访客不会停留在没有后端的静态副本上。

## 关于 HTTPS / 域名

大陆服务器对外提供服务需要域名 ICP 备案，备案期间可用 `http://IP:8787` 做小范围测试。备案通过后，再用 Nginx / Caddy 反代 80/443 到 8787。

## 更新

```bash
cd /opt/guanji-lab
sudo docker compose -f deploy/docker-compose.yml up -d --build
```

`.env` 不会被覆盖，密钥与数据库连接信息保持不变。

## 数据库

账号、会话与档案存放在独立的 PostgreSQL 容器里：

```bash
sudo docker exec -it guanji-postgres psql -U guanji -d guanji
```

表结构变更脚本在 `db/migrations/`，按序号执行。
数据目录挂载在宿主机 `/root/guanji/data/postgres`，容器重建不会丢数据。

## 验证部署是否正常

```bash
# 1) 站点能打开（会先看到内测码页面）
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8787/

# 2) 解读通道的密钥已就位
curl -s http://127.0.0.1:8787/api/chat
# 期望：{"ok":true,"provider":"deepseek","ready":true,"agents":[...]}

# 3) 未登录时账号接口应被拦住（401 = 正常）
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8787/api/account/profile
```

浏览器侧：输入内测码 → 注册一个账号 → 「我的档案」填写并保存 → 刷新页面，内容应仍在。

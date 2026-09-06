#!/usr/bin/env bash
# 观己实验室 · 腾讯云 Docker 一键部署
# 与 A股盯盘共用同一台服务器：观己默认监听 8787，不占用盯盘 8235。
#
# 用法：
#   1) 把项目上传到 /opt/guanji-lab（排除 .git）：
#      rsync -av --exclude .git /Users/yexiyan/Documents/塔罗玄学\ 心灵疗愈/ root@服务器IP:/opt/guanji-lab/
#   2) 在服务器执行：
#      cd /opt/guanji-lab && sudo bash deploy/install_guanji_docker.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="docker compose -f $APP_DIR/deploy/docker-compose.yml"

echo "== [1/4] 确认 Docker =="
docker --version
docker compose version || { echo "未找到 docker compose 插件，请先安装"; exit 1; }

echo "== [2/4] 准备 .env =="
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/deploy/.env.example" "$APP_DIR/.env"
  echo "  已生成 $APP_DIR/.env，请先填入真实密钥后重新运行本脚本"
  echo "  必填：DEEPSEEK_API_KEY、SUPABASE_SERVICE_ROLE_KEY"
  echo "  可选：GUAN_PAY_ENABLED / GUAN_PAY_GOODS_JSON（面包多商品）"
  exit 0
fi

echo "== [3/4] 构建并启动 =="
cd "$APP_DIR"
$COMPOSE build guanji
$COMPOSE up -d guanji
sleep 3
docker ps --filter name=guanji-lab --format "观己容器：{{.Names}} 状态={{.Status}}"

echo "== [4/4] 验证 =="
IP=$(hostname -I | awk '{print $1}')
echo "  站点：  http://$IP:8787"
echo "  健康：  curl http://127.0.0.1:8787/api/config"
echo "  请在腾讯云轻量控制台 → 防火墙 放行 TCP 8787"
echo ""
echo "  后续更新："
echo "  rsync -av --exclude .git /Users/yexiyan/Documents/塔罗玄学\ 心灵疗愈/ root@服务器IP:/opt/guanji-lab/"
echo "  cd /opt/guanji-lab && sudo bash deploy/install_guanji_docker.sh"

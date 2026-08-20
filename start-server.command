#!/bin/bash
# 观己实验室 · 本地预览服务器
cd "$(dirname "$0")"
echo "观己实验室已启动：http://127.0.0.1:8777"
echo "按 Ctrl+C 停止服务器"
python3 -m http.server 8777 --bind 127.0.0.1

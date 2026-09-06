# 观己实验室 · 腾讯云 Docker 镜像
# 从仓库根目录构建：docker build -f deploy/Dockerfile -t guanji-lab .
FROM node:22-alpine

WORKDIR /app

# 纯 Node 内置模块 + 静态文件，无需 npm install
COPY . .

ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787

CMD ["node", "server.js"]

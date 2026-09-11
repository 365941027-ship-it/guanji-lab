# 观己实验室 · 腾讯云 Docker 镜像
# 从仓库根目录构建：docker build -f deploy/Dockerfile -t guanji-lab .
FROM node:22-alpine

WORKDIR /app

# 先装依赖（单独一层，依赖没变时可复用缓存，加快构建）
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# 再复制其余文件
COPY . .

ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787

CMD ["node", "server.js"]

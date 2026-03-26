# --- 第一阶段：构建前端 UI ---
FROM node:20-alpine AS UI-builder
WORKDIR /app/UI
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# 假设打包命令是 npm run build，产物在 /app/UI/dist
RUN npm run build

# --- 第二阶段：构建后端 Hono ---
FROM node:20-alpine AS backend-builder
WORKDIR /app/Backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
# 如果你使用 TypeScript，可以在这里进行编译，或者直接运行 ts-node/tsx
# 这里演示直接拷贝代码，由后端服务托管静态文件

# --- 第三阶段：最终运行环境 ---
FROM node:20-alpine
WORKDIR /app

# 1. 仅拷贝运行所需的依赖（生产环境）
COPY backend/package*.json ./
RUN npm install --omit=dev

# 2. 从前面的阶段拷贝编译好的前端产物到后端指定的 dist 目录
COPY --from=UI-builder /app/UI/dist ./dist

# 3. 拷贝后端运行代码
COPY backend/ .

# 暴露端口（Hono 监听的端口）
EXPOSE 3000

# 启动服务
CMD ["node", "index.js"] 
# 注意：如果是直接运行 .ts 文件，建议先用 tsc 编译成 .js，或者使用 node --import tsx index.ts

# Build stage: build the Vite app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json package-lock*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "-e", "require('http').createServer((req, res) => { const fs = require('fs'); const path = require('path'); let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url); if (!path.extname(filePath)) filePath = path.join(__dirname, 'dist', 'index.html'); fs.readFile(filePath, (err, data) => { if (err) { res.writeHead(404); res.end('Not found'); } else { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); } }); }).listen(3000, () => console.log('Server running on port 3000'));"]
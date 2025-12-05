# Stage 1: Build - Compile React com Vite
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json package-lock*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build with Vite (injeta VITE_API_URL em tempo de build)
ARG VITE_API_URL=http://23.22.153.89:3000
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage 2: Runtime - Serve com servidor estático
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install serve para servir arquivos estáticos
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser
EXPOSE 3000

# Serve os arquivos estáticos na porta 3000
# -s flag: serve single page application (redireciona para index.html)
# -l flag: listen port
CMD ["serve", "-s", "dist", "-l", "3000"]
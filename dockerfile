# =========================
# STAGE 1 — BUILDER
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Build args para variáveis de ambiente (injeta em tempo de build)
ARG VITE_API_BASE_URL

# Passando para o build do Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copiar fonte e fazer build
COPY . .
RUN npm run build

# =========================
# STAGE 2 — RUNTIME
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Criar usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Instalar serve globalmente para servir arquivos estáticos
RUN npm install -g serve

# Copiar build do stage anterior
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# Alternar para usuário não-root
USER appuser

EXPOSE 8080

# Servir a SPA na porta 8080 com fallback para index.html
# -s: single page application mode (redireciona rotas para index.html)
# -l: listen port
CMD ["serve", "-s", "dist", "-l", "8080"]
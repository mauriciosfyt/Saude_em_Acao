# Estágio de Build
FROM node:18-alpine AS builder
WORKDIR /app

# Declarar que aceitamos esse argumento na hora do build
ARG VITE_API_URL

# Transformar o argumento em variável de ambiente para o processo de build do Node
ENV VITE_API_URL=${VITE_API_URL}

# Copiar arquivos de dependência primeiro (cache layer)
COPY package*.json ./
RUN npm ci

# Copiar o resto do código
COPY . .

# Construir o projeto (Aqui o Vite pega a variável e crava no JS)
RUN npm run build

# Estágio de Execução (Runner)
FROM node:18-alpine AS runner
WORKDIR /app

# Instalar 'serve' globalmente
RUN npm install -g serve

# Copiar apenas a pasta dist gerada no estágio anterior
COPY --from=builder /app/dist ./dist

# Expor a porta 8080
EXPOSE 8080

# Rodar o serve na porta 8080 (single page application mode)
CMD ["serve", "-s", "dist", "-l", "8080"]
# Estágio de Build
FROM node:18-alpine AS builder
WORKDIR /app

# Declarar que aceitamos esse argumento na hora do build
ARG VITE_KNOW_API_URL
ARG VITE_API_URL

# Transformar o argumento em variável de ambiente para o processo de build do Node
ENV VITE_KNOW_API_URL=${VITE_KNOW_API_URL}
ENV VITE_API_URL=${VITE_API_URL}

# Copiar arquivos de dependência primeiro (cache layer)
COPY package*.json ./
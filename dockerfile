# ========================= 
# STAGE 1 — BUILDER
# ========================= 
FROM node:20-alpine AS builder

WORKDIR /app

# Accept VITE_API_URL as build argument
ARG VITE_API_URL

# Set environment variable for Vite build
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files (cache layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Vite application
RUN npm run build

# ========================= 
# STAGE 2 — RUNNER (Nginx)
# ========================= 
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
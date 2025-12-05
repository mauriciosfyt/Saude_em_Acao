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

# Create saudeemacao user
RUN addgroup -S saudeemacao && adduser -S saudeemacao -G saudeemacao

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Set permissions
RUN chown -R saudeemacao:saudeemacao /usr/share/nginx/html && \
    chown -R saudeemacao:saudeemacao /var/cache/nginx && \
    chown -R saudeemacao:saudeemacao /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R saudeemacao:saudeemacao /var/run/nginx.pid

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# User for container
USER saudeemacao:saudeemacao

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
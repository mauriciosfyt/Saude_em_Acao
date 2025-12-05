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
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Cache busting for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# User for container
USER saudeemacao:saudeemacao

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

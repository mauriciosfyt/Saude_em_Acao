# Builder image: install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json package-lock*.json yarn.lock pnpm-lock.yaml ./
RUN set -eux; \
  if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    npm install -g yarn && yarn install --frozen-lockfile; \
  else \
    npm ci; \
  fi

# Build step: compile the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm prune --production

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

# Runtime image: slim and non-root
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8085

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
# Optional: copy next.config.js or other runtime files if present
COPY --from=builder --chown=appuser:appgroup /app/next.config.js ./next.config.js

USER appuser
EXPOSE 8085
CMD ["npm", "start"]

<<<<<<< HEAD
=======
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
>>>>>>> 5a19807afbb73cf7dc7c8b94f0fb2af2c3bf3ce3

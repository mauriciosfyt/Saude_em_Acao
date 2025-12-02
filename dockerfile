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

# Runtime image: slim and non-root
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

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
EXPOSE 3000
CMD ["npm", "start"]
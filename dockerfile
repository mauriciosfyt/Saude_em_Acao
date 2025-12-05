# Builder image: install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN set -eux; \
  npm ci

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

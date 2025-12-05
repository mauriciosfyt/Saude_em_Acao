# Build stage: build the Vite app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json package-lock*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage: serve with nginx
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config (provides SPA fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
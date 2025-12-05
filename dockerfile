# Build stage: build the Vite app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json package-lock*.json ./
RUN npm ci
COPY . .
RUN --mount=type=secret,id=VITE_API_BASE_URL \
    VITE_API_BASE_URL=$(cat /run/secrets/VITE_API_BASE_URL) \
    npm run build

# Production stage: serve with node
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

# Accept build argument for Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Build the Vite project
RUN npm run build

# Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
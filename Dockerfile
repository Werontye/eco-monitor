# Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Build backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install server dependencies
RUN npm ci

# Copy server source code
COPY server/ .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install nginx
RUN apk add --no-cache nginx gettext

# Copy built frontend to nginx
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy built backend
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package.json ./server/

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 80

CMD ["/start.sh"]

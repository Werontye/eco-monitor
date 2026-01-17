# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration template (uses envsubst for PORT variable)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port (Railway sets PORT dynamically)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

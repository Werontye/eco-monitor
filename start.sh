#!/bin/sh

# Set default port if not provided
export PORT=${PORT:-80}
export API_PORT=3001

# Generate nginx config from template
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf

# Start the Node.js backend server in background
cd /app/server
node dist/index.js &

# Start nginx in foreground
nginx -g 'daemon off;'

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

# Configure nginx
RUN echo 'server { \
  listen 3001; \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri /index.html; \
  } \
  location /api { \
    proxy_pass http://backend:5001; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]

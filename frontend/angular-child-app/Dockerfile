# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production (Single-SPA mode)
RUN npm run build:single-spa

# Production stage - serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets - Angular outputs to dist/angular-child-app/browser
COPY --from=build /app/dist/angular-child-app/browser /usr/share/nginx/html

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4200/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

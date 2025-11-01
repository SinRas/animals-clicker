# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Leverage Docker layer caching
COPY package.json .
COPY package-lock.json .
# Choose your installer; default to npm
RUN npm ci

# Copy the rest and build
COPY . .
# Vite typically outputs to /dist; CRA to /build
# Override with: --build-arg BUILD_DIR=dist
ARG BUILD_DIR=dist
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine
# SPA routing: serve index.html for unknown paths
COPY ./src/nginx-spa.conf /etc/nginx/conf.d/default.conf
# Copy compiled assets from builder
ARG BUILD_DIR=dist
COPY --from=build /app/${BUILD_DIR}/ /usr/share/nginx/html/

# Optional: non-root (nginx image runs as root by default)
# RUN adduser -D -u 10001 app && chown -R app:app /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html
# USER app

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=2s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

# ==============================================================================
# eCom Frontend — React + Vite Production Image
# ==============================================================================
# Build:   docker build -t ecom/frontend:v1.0.0 .
# Run:     docker run -p 80:80 ecom/frontend:v1.0.0
# ==============================================================================

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 1 — Build the React app with Vite
# ──────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the source code
COPY . .

# Build for production — Vite reads .env.production automatically
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# STAGE 2 — Serve static assets with Nginx
# ──────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS final

# Remove default nginx config (replaced by our custom config below)
RUN rm -f /etc/nginx/conf.d/default.conf

# Our custom config: handles SPA routing + proxies /api/* to the gateway
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container
EXPOSE 80

# Verify build succeeded (fail early if dist is empty)
RUN test -f /usr/share/nginx/html/index.html \
    || (echo "ERROR: index.html not found in /app/dist — check your Vite build output dir." && exit 1)

# Run nginx in foreground (required for Docker to keep the container alive)
CMD ["nginx", "-g", "daemon off;"]
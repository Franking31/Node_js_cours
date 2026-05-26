FROM node:20-alpine AS base
WORKDIR /app

# ───── deps stage ─────
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ───── dev stage ─────
FROM deps AS dev
COPY . .
EXPOSE ${PORT:-3000}
CMD ["npm", "run", "dev"]

# ───── build stage ─────
FROM deps AS builder
COPY . .
RUN npm run build

# ───── prod stage ─────
FROM nginx:alpine AS prod
WORKDIR /app
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
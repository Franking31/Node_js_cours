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
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE ${PORT:-3001}
CMD ["npm", "run", "start"]
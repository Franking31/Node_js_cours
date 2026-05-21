# ===== 1. Build stage =====
FROM node:20-alpine AS builder

WORKDIR /app

# installer deps
COPY package*.json ./
RUN npm ci

# copier le code
COPY . .

# build Next.js
RUN npm run build


# ===== 2. Production stage =====
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# installer uniquement les deps nécessaires
COPY package*.json ./
RUN npm ci --omit=dev

# copier build depuis stage précédent
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
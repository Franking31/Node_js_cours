FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache wget postgresql-client

# ───── deps stage ─────
FROM base AS deps
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma/ ./prisma/
RUN npm ci

# ───── dev stage ─────
FROM deps AS dev
COPY --chown=node:node src/ ./src/
COPY --chown=node:node prisma/ ./prisma/
RUN npx prisma generate
RUN mkdir -p /app/logs && chown -R node:node /app
USER node
EXPOSE ${PORT}
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run dev"]

# ───── prod stage (sans build) ─────
FROM base AS prod
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma/ ./prisma/
RUN npm ci --omit=dev
COPY --chown=node:node src/ ./src/
RUN npx prisma generate
RUN mkdir -p /app/logs && chown -R node:node /app
USER node
EXPOSE ${PORT}
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run start"]
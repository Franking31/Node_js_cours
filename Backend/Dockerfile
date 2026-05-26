FROM node:22-alpine AS base

WORKDIR /app


RUN apk add --no-cache \
    wget \
    postgresql-client

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma 

RUN npm ci

COPY --chown=node:node prisma/ ./prisma/
COPY --chown=node:node src/ ./src/


RUN npx prisma generate

RUN mkdir -p /app/logs \
    && chown -R node:node /app

EXPOSE ${PORT}

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run start"]
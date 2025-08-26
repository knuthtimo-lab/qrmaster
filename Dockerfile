# ---- deps ----
FROM node:20-alpine AS deps
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
# Copy prisma schema for postinstall script
COPY prisma ./prisma
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    npm i -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    npm install --legacy-peer-deps; \
  fi

# ---- builder ----
FROM node:20-alpine AS builder
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Add build-time environment variables with defaults
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/qrmaster?schema=public"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXTAUTH_SECRET="build-time-secret"
ENV IP_SALT="build-time-salt"
RUN npx prisma generate
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
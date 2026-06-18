ARG NODE_VERSION=24

# Base image
FROM node:${NODE_VERSION}-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable;

# Main image
FROM base AS main

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch;
RUN pnpm approve-builds --all;
RUN pnpm install --frozen-lockfile --ignore-scripts=false;

# Dev image
FROM main AS dev

COPY . .

CMD ["pnpm", "run", "dev"]

# Storybook image
FROM main AS storybook

COPY . .

EXPOSE 6006
CMD ["pnpm", "storybook", "--host", "0.0.0.0", "--no-open", "--disable-telemetry"]

# Builder image
FROM main AS builder

ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG API_BASE_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENV
ARG NEXT_PUBLIC_SENTRY_RELEASE
ARG NEXT_PUBLIC_UMAMI_SRC
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID

ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_ENV=$NEXT_PUBLIC_SENTRY_ENV
ENV NEXT_PUBLIC_SENTRY_RELEASE=$NEXT_PUBLIC_SENTRY_RELEASE
ENV NEXT_PUBLIC_UMAMI_SRC=$NEXT_PUBLIC_UMAMI_SRC
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID

COPY . .

RUN pnpm run build;

# Production image
FROM base AS prod

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs;
RUN adduser --system --uid 1001 nextjs;
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]

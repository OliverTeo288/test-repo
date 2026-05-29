# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time ARGs — pass via `docker build --build-arg APP_VERSION=1.2.3`
# These are available only during the build. Defaults are shown below.
ARG APP_VERSION=dev
ARG BUILD_DATE=unknown
ARG GIT_COMMIT=unknown

COPY package.json .
RUN npm install --omit=dev

# Bake the build-time values into a static JSON file inside the image.
# The app reads this file at startup — the values are fixed until the next build.
RUN echo "{\"version\":\"${APP_VERSION}\",\"buildDate\":\"${BUILD_DATE}\",\"gitCommit\":\"${GIT_COMMIT}\"}" \
    > /app/build-info.json

COPY src/ ./src/

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/ .

EXPOSE 3000

# Non-root user for container security
USER node

CMD ["node", "src/index.js"]

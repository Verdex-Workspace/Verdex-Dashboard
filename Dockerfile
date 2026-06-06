# syntax=docker/dockerfile:1

# ============================================================
# Verdex Dashboard — image multi-stage
#   - stage `dev`   : serveur Vite avec hot-reload (compose local)
#   - stage `build` : compilation de l'app
#   - stage `prod`  : Nginx servant les fichiers statiques
# Note : la production cible Vercel ; cette image sert au local
# et aux déploiements auto-hébergés éventuels.
# ============================================================
ARG NODE_VERSION=22-alpine

# ---------- base ----------
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# ---------- dependencies ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- dev (hot reload) ----------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]

# ---------- build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- prod (nginx) ----------
FROM nginx:1.27-alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]

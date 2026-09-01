# syntax=docker/dockerfile:1

# =========================================================
# Etapa 1: "deps" - Instalación de dependencias
# =========================================================
# Next.js 16 requiere Node.js >= 20.9, por eso se usa node:20-alpine
# (LTS activo) en las tres etapas.
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

# Aquí SÍ se instalan devDependencies (npm ci normal, sin --omit=dev)
# porque Tailwind, ESLint y el propio proceso de "next build" son
# necesarios para construir el proyecto. Se eliminan en la etapa final.
RUN npm ci

# =========================================================
# Etapa 2: "builder" - Compilación de producción de Next.js
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_API_URL se "hornea" (embebe) dentro del bundle de
# JavaScript en tiempo de BUILD, no en tiempo de arranque del
# contenedor. Por eso debe pasarse como build-arg y no como variable
# de entorno normal de docker-compose (ver docker-compose.yml).
#
# IMPORTANTE: este valor lo usa el NAVEGADOR del usuario (código
# "use client"), no el contenedor del backend. Por eso debe ser una URL
# alcanzable desde la máquina del usuario (ej. http://localhost:3001),
# y NO el nombre interno del servicio Docker (ej. http://backend:3001),
# que solo es resoluble entre contenedores.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# =========================================================
# Etapa 3: "runner" - Imagen final de producción
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Gracias a "output: standalone" (agregado en next.config.mjs), Next.js
# genera un servidor Node.js mínimo con solo los node_modules
# realmente usados. Esto evita copiar el node_modules completo
# (cientos de MB) a la imagen final.
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

# Usuario no root incluido por defecto en las imágenes oficiales de Node.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

# El build "standalone" genera su propio server.js en la raíz,
# reemplazando "next start".
CMD ["node", "server.js"]

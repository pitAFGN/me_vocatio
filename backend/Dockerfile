# syntax=docker/dockerfile:1

# =========================================================
# Etapa 1: "deps" - Instalación de dependencias
# =========================================================
# Se usa node:20-alpine porque es una imagen oficial, ligera (~5x más
# pequeña que la imagen "full") y con soporte activo (Node 20 LTS).
FROM node:20-alpine AS deps

WORKDIR /app

# python3, make y g++ son necesarios porque el package.json incluye
# dependencias con posibles módulos nativos (ej. bcrypt). Se instalan
# SOLO en esta etapa de build y no viajan a la imagen final.
RUN apk add --no-cache python3 make g++

# Se copian primero los manifiestos de dependencias (package.json y
# package-lock.json) y no el resto del código. Así, Docker reutiliza
# la capa de "npm ci" en cache mientras no cambien las dependencias,
# aunque el código fuente cambie constantemente.
COPY package.json package-lock.json ./

# npm ci (en vez de npm install) instala exactamente las versiones del
# lockfile, de forma reproducible y más rápida. --omit=dev excluye
# devDependencies (jest, supertest) que no se necesitan en producción.
RUN npm ci --omit=dev \
    && npm cache clean --force

# =========================================================
# Etapa 2: "runner" - Imagen final de producción
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# NODE_ENV=production hace que Express y las librerías activen
# optimizaciones internas (menos logging, mejor rendimiento).
ENV NODE_ENV=production

# Se copian únicamente los node_modules ya instalados (sin python3,
# make, g++, ni cache de npm), reduciendo drásticamente el tamaño y la
# superficie de ataque de la imagen final.
COPY --from=deps /app/node_modules ./node_modules

# Se copia solo lo estrictamente necesario para ejecutar el servidor:
# el manifiesto (útil para trazabilidad/versión) y el código fuente.
# No se copian __test__, README.md, .env, .git, etc. (ver .dockerignore).
COPY package.json ./
COPY src ./src
COPY sql ./sql

# La imagen oficial de Node ya trae creado un usuario sin privilegios
# llamado "node" (uid 1000). Ejecutar como root dentro del contenedor
# es una mala práctica de seguridad; con esta línea el proceso corre
# como usuario no root.
USER node

# Puerto en el que escucha Express (backend/src/server.js -> process.env.PORT || 3001).
EXPOSE 3001

# Comprobación de salud: Docker puede saber si el backend está realmente
# respondiendo, no solo si el proceso sigue vivo.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3001/api-docs', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

# Arranque en modo producción (equivalente a "npm start", pero sin la
# capa extra de npm, lo que hace que las señales de STOP/kill de Docker
# lleguen directamente al proceso de Node).
CMD ["node", "src/server.js"]

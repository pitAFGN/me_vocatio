# 💎 MeVocatio — Backend

API REST del proyecto MeVocatio. Gestiona autenticación (manual y con Google), verificación de email, recuperación de contraseña, diagnóstico y recomendación vocacional con IA, cursos con flujo editorial, pagos con Wompi, gamificación (XP, racha y logros), roles de usuario y administración.

---

## Tecnologías

| Paquete | Uso |
|---|---|
| Express 5 | Servidor HTTP y enrutamiento |
| PostgreSQL + pg | Base de datos relacional |
| bcryptjs | Hash de contraseñas |
| jsonwebtoken | Tokens de acceso (15 min) y de refresco (7 días) HS256 |
| googleapis (Gmail API) | Envío de correos por HTTPS (verificación y recuperación) |
| @supabase/supabase-js | Validación del token de Google (account linking) |
| openai | SDK de OpenAI apuntando a Groq (diagnósticos, recomendaciones y análisis de recursos) |
| yt-search | Búsqueda de videos reales de YouTube para recursos recomendados |
| helmet | Cabeceras HTTP de seguridad |
| express-rate-limit | Límites de intentos por IP/usuario/email |
| express-validator | Validación y sanitización de inputs |
| swagger-jsdoc + swagger-ui-express | Documentación interactiva de la API |
| dotenv | Variables de entorno |

---

## Estructura

```
backend/
├── src/
│   ├── server.js                # Punto de entrada (CORS, CSRF, helmet, swagger, tareas programadas)
│   ├── config/
│   │   ├── db.js                # Pool de PostgreSQL (SSL autoderivado)
│   │   ├── mailer.js            # Cliente de Gmail API (googleapis) con firma nodemailer-compatible
│   │   ├── swagger.js           # Configuración de Swagger (OpenAPI 3.0)
│   │   └── wompi.js             # Cliente de la API de Wompi (sandbox/producción)
│   ├── controllers/
│   │   ├── auth.controller.js   # Autenticación (manual, Google, verificación, recuperación)
│   │   ├── user.controller.js   # XP y evaluaciones del usuario
│   │   ├── course.controller.js # Cursos, reseñas, inscripciones y progreso
│   │   ├── payment.controller.js# Pagos premium y de cursos con Wompi
│   │   ├── achievement.controller.js # Logros del usuario
│   │   ├── recomendation.controller.js # Diagnóstico, evaluación, recomendación y análisis IA
│   │   ├── admin.controller.js  # Estadísticas, gestión de cursos, recursos y usuarios
│   │   └── alternativeLogin.controller.js # Account linking con Google
│   ├── middlewares/
│   │   ├── authMiddleware.js    # authenticateToken, optionalAuth, requirePremium, authorizeRoles
│   │   ├── csrfOrigin.js        # Defensa CSRF por Origin (exime el webhook de Wompi)
│   │   ├── rateLimiter.js       # Límites por IP/usuario/email
│   │   ├── dailyLimitMiddleware.js # Límite diario de peticiones IA (free 5 / premium 100)
│   │   ├── recaptcha.js         # Verificación de Google reCAPTCHA en el registro
│   │   ├── alternativeLogin.js  # Validación del token de Supabase (Google)
│   │   ├── validarInputs.js     # Reglas express-validator + validar()
│   │   └── validarPassword.js   # Reglas de contraseña fuerte
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth/* (+ documentación Swagger)
│   │   ├── user.routes.js       # /api/users/*
│   │   ├── course.routes.js     # /api/courses/*
│   │   ├── payment.routes.js    # /api/pagos/*
│   │   ├── achievement.routes.js# /api/achievements
│   │   ├── recomendation.routes.js # /api/generar, /evaluar, /recomendar, /analizar
│   │   └── admin.routes.js      # /api/admin/*
│   ├── services/
│   │   ├── auth.service.js      # Lógica de negocio de autenticación
│   │   ├── email.service.js     # Plantillas y envío de correos editoriales
│   │   ├── course.service.js    # Cursos, revisión editorial y reseñas
│   │   ├── payment.service.js   # Referencias, firma de integridad y estados Wompi
│   │   ├── recomendation.service.js # IA con Groq, URLs seguras y análisis premium
│   │   ├── achievement.service.js # Evaluación y otorgamiento de logros
│   │   ├── xp.service.js        # XP por acción y recalculo de nivel
│   │   └── streak.service.js    # Racha de días consecutivos
│   └── utils/
│       ├── jwt.js               # Emisión de access/refresh tokens
│       ├── authCookies.js       # Cookies httpOnly access_token + session_id
│       ├── sessionStore.js      # Refresh tokens en la tabla `sessions`
│       └── tokens.js            # Magic links de un solo uso (hash SHA-256 en BD)
├── sql/                         # Migraciones numeradas (001…018) + run-migration.js
├── scripts/                     # simulate-wompi-webhook.js
├── __test__/                    # Pruebas con Jest
├── Dockerfile                   # node:22-alpine multi-stage
├── .env / .env.example
└── package.json
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/pitAFGN/me_vocatio
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores reales
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del backend con los siguientes valores:

```env
DATABASE_URL=postgresql://USUARIO:PASSWORD@HOST/DATABASE?sslmode=require
FRONTEND_URL=http://localhost:3000
GROQ_MODEL=openai/gpt-oss-120b
TRUST_PROXY=1
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true

# JWT y sesión
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Gmail API (envío de correos por HTTPS)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=

# Supabase (login con Google)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Google reCAPTCHA (registro)
RECAPTCHA_SECRET_KEY=

# IA (Groq)
GROQ_API_KEY=

# Pagos Wompi
WOMPI_ENV=sandbox
WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_INTEGRITY_SECRET=
WOMPI_EVENTS_SECRET=

# Swagger: /api-docs se expone fuera de producción; en producción solo si se fuerza
SWAGGER_ENABLED=false
```

Notas:
- `JWT_ACCESS_SECRET` debe ser **idéntico** al `JWT_ACCESS_SECRET` del frontend.
- `TRUST_PROXY` indica los hops de proxy confiables (1 para Railway/Render, "false" para desactivarlo).
- `EMAIL_VERIFICATION_EXPIRES_HOURS` (opcional, default 24 h) controla la expiración de los magic links.

---

## Comandos

```bash
# Desarrollo (reinicio automático con nodemon)
npm run dev

# Producción
npm start

# Pruebas (Jest + Supertest)
npm test
```

Al iniciar correctamente verás:
```
Base de datos conectada correctamente
```

---

## Documentación interactiva

Con el servidor corriendo, accede a Swagger UI en:

```
http://localhost:3001/api-docs
```

Desde ahí puedes probar todos los endpoints directamente en el navegador. Se expone automáticamente fuera de producción (u obligando con `SWAGGER_ENABLED=true`).

---

## Seguridad implementada

- **Helmet** — cabeceras HTTP que protegen contra XSS, clickjacking y sniffing de contenido
- **CSRF por Origin** — middleware global que rechaza con 403 las mutaciones cuyo `Origin` no esté en la lista blanca (exime el webhook de Wompi)
- **Rate limiting** — límites por IP, usuario y email en login, registro, recuperación, verificación, IA y XP
- **Límite diario de IA** — 5 peticiones/día para cuentas free y 100/día para premium
- **Validación server-side** — todos los inputs se validan y sanitizan antes de llegar al controlador
- **Hash de contraseñas** — bcryptjs con salt de 10 rondas, nunca se guarda en texto plano
- **JWT con expiración** — access de 15 min y refresh de 7 días con rotación; las sesiones viven en la tabla `sessions`
- **reCAPTCHA** — el registro exige un `captchaToken` verificado contra Google
- **Magic links de un solo uso** — tokens de 256 bits guardados como hash SHA-256, expiran a las 24 h
- **Verificación de email obligatoria** — las cuentas sin verificar no pueden iniciar sesión y se depuran (cuentas fantasma con >24 h)
- **Body limit** — el servidor rechaza peticiones con body mayor a 1 MB

---

## Flujo de la petición

```
Petición HTTP
    │
    ├── csrfOrigin (global)    → rechaza 403 si el Origin no es de confianza
    ├── rateLimiter            → rechaza si supera el límite de intentos
    ├── authMiddleware         → rechaza sin token válido (rutas protegidas)
    ├── validarInputs          → rechaza si los campos son inválidos o peligrosos
    ├── controller             → maneja req/res
    └── service                → lógica de negocio + acceso a la BD
```

Los flujos con IA (`/api/generar`, `/api/recomendar`, `/api/analizar`) incluyen además `checkDailyLimit` para el límite diario, y `/api/analizar` exige plan premium (`requirePremium`).

---
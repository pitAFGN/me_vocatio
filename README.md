# 💎 MeVocatio — Frontend

Aplicación web de orientación profesional desarrollada con **Next.js 16** y **React 19**. Permite registrarse (manual o con Google), iniciar sesión, explorar vocaciones, responder diagnósticos de carrera generados por IA, recibir recomendaciones de recursos, acceder a cursos, gamificar el estudio (XP, niveles, racha e insignias), y contratar un plan premium con pagos a través de Wompi. Incluye un panel de administración.

---

## Tecnologías

| Paquete | Uso |
|---|---|
| Next.js 16 | Framework React con App Router y middleware de servidor (`src/proxy.js`) |
| React 19 | Librería de interfaces de usuario |
| Tailwind CSS 4 | Estilos utilitarios |
| Framer Motion | Animaciones (carrusel de opiniones, modales de nivel, etc.) |
| Lucide React | Íconos |
| SweetAlert2 | Alertas y modales de confirmación |
| jose | Verificación de tokens JWT (HS256) en el middleware de servidor |
| @supabase/supabase-js | Login con Google (flujo PKCE) |
| react-google-recaptcha | Verificación de captcha en el registro |
| react-markdown + remark-gfm | Render del análisis de IA en formato Markdown |
| recharts | Gráficas del panel de administración |
| @react-three/fiber + drei | Escena 3D del diamante en el landing |

---

## Estructura

```
frontend/
├── src/
│   ├── proxy.js                 # Middleware del servidor: valida la firma JWT,
│   │                            #   protege rutas privadas y exige rol admin en /admin
│   ├── app/                     # Enrutamiento de Next.js (App Router)
│   │   ├── layout.js            # Layout global (Navbar, tema, notificación de logros)
│   │   ├── page.js              # Landing page con diamante 3D
│   │   ├── login/               # Login, registro (reCAPTCHA + Google) y recuperación
│   │   ├── verify-email/        # Verificación de correo con magic link
│   │   ├── reset-password/      # Cambio de contraseña con token
│   │   ├── nosotros/            # Página institucional
│   │   ├── dashboard/           # Panel con XP, nivel, racha y acceso al plan premium
│   │   ├── recomendacion/       # Recursos recomendados por IA + chat "Gemini" premium
│   │   ├── diagnostico/[id]/    # Test de diagnóstico vocacional (8 preguntas)
│   │   ├── vocaciones/[grupo]/  # Grupos de vocaciones (generación estática)
│   │   ├── vocacion/[slug]/     # Detalle de una vocación (generación estática)
│   │   ├── mis-rutas/           # Evaluaciones de diagnóstico del usuario
│   │   ├── insignias/           # Logros desbloqueados
│   │   ├── favoritos/           # Vocaciones y recursos guardados
│   │   ├── curso/[id]/          # Página de curso con reseñas y progreso
│   │   ├── creacion_recursos/   # Creación de cursos (flujo editorial + premium)
│   │   ├── configuracion/       # Perfil, plan premium y cambio de contraseña
│   │   ├── pago-resultado/      # Resultado del pago con Wompi
│   │   └── admin/               # Panel de administración con gráficas (recharts)
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── auth/                # AuthForm (reCAPTCHA, Google, modal de olvidé contraseña)
│   │   ├── dashboard/           # DashboardHome, XpLevelCard, LevelUpModal, SidebarNav
│   │   ├── creacion_recursos/   # Formularios y paneles del creador de cursos
│   │   ├── landing/             # Escena 3D, vocaciones, carrusel de opiniones, footer
│   │   └── …                    # Navbar, NavbarProfile, ResourceAiModal, ConfirmModal, Toast…
│   │
│   ├── hooks/                   # Lógica reutilizable
│   │   ├── useAuth.js           # Login, registro, logout, recuperación, verificación
│   │   ├── useRouteGuard.js     # Protección de rutas (cliente): pública, privada y admin
│   │   ├── usePayment.js        # Widget de Wompi e inicio de pago premium
│   │   └── useFavorites.js      # Favoritos de vocaciones y recursos (localStorage)
│   │
│   ├── services/                # Llamadas a la API
│   │   ├── auth.service.js      # Todos los endpoints de autenticación
│   │   └── payment.service.js   # Endpoints de pagos
│   │
│   ├── lib/                     # Utilidades y configuración
│   │   ├── constants.js         # API_URL, reCAPTCHA y credenciales de Supabase
│   │   ├── supabase.js          # Cliente de Supabase lazy (login con Google)
│   │   ├── wompi.js             # Script del WidgetCheckout de Wompi
│   │   └── vocationGroups.js    # Catálogo de vocaciones y temas visuales
│   └── data/professions.js      # Datos estáticos de las vocaciones
└── test/                        # Pruebas con Vitest
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/pitAFGN/me_vocatio
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores reales
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
JWT_ACCESS_SECRET=
API_UPSTREAM_URL=
```

- `NEXT_PUBLIC_API_URL`: URL del backend que usa el navegador (se embebe en el bundle en tiempo de build).
- `JWT_ACCESS_SECRET`: debe ser **idéntico** al `JWT_ACCESS_SECRET` del backend para que `src/proxy.js` verifique la firma y proteja las rutas del lado servidor.
- `API_UPSTREAM_URL`: URL del backend en producción; `next.config.mjs` reescribe `/api/*` hacia este upstream.

---

## Comandos

```bash
# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Iniciar en producción (requiere build previo)
npm start

# Build + iniciar en producción
npm run review

# Linter
npm run lint

# Pruebas
npm test
npm run test:watch
```

La aplicación corre por defecto en `http://localhost:3000`.

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing page |
| `/nosotros` | Público | Página institucional |
| `/login` | Público* | Iniciar sesión, registrarse o recuperar contraseña |
| `/verify-email` | Público | Verificar el correo con el magic link |
| `/reset-password?token=...` | Público | Cambiar contraseña con token del correo |
| `/vocaciones/[grupo]` | Público | Grupos de vocaciones |
| `/vocacion/[slug]` | Público | Detalle de una vocación |
| `/dashboard` | Privado | Panel con XP, nivel, racha y plan premium |
| `/diagnostico/[id]` | Privado | Test de diagnóstico vocacional |
| `/recomendacion` | Privado | Recursos recomendados por IA (chat premium) |
| `/mis-rutas` | Privado | Evaluaciones de diagnóstico del usuario |
| `/insignias` | Privado | Logros desbloqueados |
| `/favoritos` | Privado | Vocaciones y recursos guardados |
| `/curso/[id]` | Privado | Detalle de un curso con reseñas y progreso |
| `/creacion_recursos` | Privado | Creación de cursos |
| `/configuracion` | Privado | Perfil, plan premium y contraseña |
| `/pago-resultado` | Privado | Resultado del pago con Wompi |
| `/admin` | Admin | Panel de administración con gráficas |

\* Si ya hay sesión activa, `/login` redirige automáticamente a `/dashboard`.

---

## Flujo de autenticación

```
Usuario ingresa credenciales
        │
        ├── useAuth.login()
        ├── authService.login()         ← POST /api/auth/login (+ reCAPTCHA en registro)
        ├── El backend setea cookies httpOnly: access_token + session_id
        └── Redirige a /dashboard

Login con Google
        │
        ├── Sign-in con Supabase (PKCE)
        ├── authService.googleSync()    ← POST /api/auth/google-sync (token de Supabase)
        └── El backend hizo account linking (crea o vincula la cuenta) y setea cookies

Al entrar a ruta privada
        │
        └── src/proxy.js (servidor) + useProtectedRoute() (cliente)
              ├── proxy valida la firma del JWT con jose (HS256)
              ├── Token expirado → deja pasar y el cliente renueva con el refresh token
              ├── Sin token → redirige a /login
              └── /admin exige además rol `admin` y token vigente

Al entrar a ruta pública (login, landing)
        │
        └── usePublicRoute()
              ├── Lee el token de la cookie
              ├── Con token vigente → redirige a /dashboard
              └── Sin token → permite el acceso
```

---

## Componentes principales

### `proxy.js` — Guard de servidor
Middleware de Next.js que valida la firma JWT (HS256) de la cookie `access_token` y protege las rutas privadas del lado servidor. `defensa en profundidad`: `/admin` exige además rol `admin`.

### `useAuth` — Hook de autenticación
Centraliza login, registro, login con Google, logout, recuperación y verificación de email.

```js
const { login, register, googleLogin, logout, forgotPassword, resetPassword, verifyEmail } = useAuth();
```

### `authService` / `paymentService` — Servicios de API
Puntos de contacto con el backend. La URL base se define en `lib/constants.js` y se puede sobreescribir con `NEXT_PUBLIC_API_URL`.

### `useRouteGuard` — Protección de rutas (cliente)
`useProtectedRoute` para rutas privadas, `usePublicRoute` para públicas y `useAdminRoute` para el panel de administración. Retornan `loading: true` mientras verifican la sesión para evitar flasheos.

### `XpLevelCard` + `LevelUpModal` — Gamificación
Muestran XP, nivel y racha en el dashboard; notifican con animación cada subida de nivel.

### `ResourceAiModal` — Chat "Gemini" (premium)
Analiza un recurso con IA (POST `/api/analizar`) y muestra el resultado en Markdown con `react-markdown` + `remark-gfm`.

### `GlobalAchievementListener` — Logros
Escucha los logros desbloqueados y muestra el toast con la insignia en toda la app.

---

## Seguridad implementada

- **Guard de servidor con JWT** — `src/proxy.js` verifica la firma HS256 del `access_token` (con `jose`) antes de permitir el acceso a rutas privadas; no depende solo del cliente.
- **Rol admin verificado en servidor** — `/admin` exige token vigente con payload `role === "admin"`; la autoridad real sigue siendo el backend.
- **Cookies `HttpOnly`** — el `access_token` viaja en cookie `HttpOnly` (y `Secure` + `SameSite=None` en producción), no queda expuesto al JavaScript.
- **reCAPTCHA en el registro** — verificada también del lado del backend.
- **Validación por campo** — mensajes de error individuales en login y registro; mensajes del backend humanizados.
- **Bloqueo de DevTools** — clic derecho, atajos de teclado (`F12`, `Ctrl+Shift+I`) y detección de la apertura.
- **Verificación de email obligatoria** — las cuentas sin verificar no pueden iniciar sesión.
- **Rewrite `/api/*` con CSP** — la comunicación con el backend se hace same-origin vía `next.config.mjs`.

---

## Conexión con el Backend

Toda la comunicación con la API sale de `services/`. La URL base se define en `lib/constants.js` (variable `NEXT_PUBLIC_API_URL`), y en producción `next.config.mjs` reescribe `/api/*` hacia `API_UPSTREAM_URL` para que sea same-origin.

| Acción | Método | Endpoint |
|---|---|---|
| Registro | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Login con Google | POST | `/api/auth/google-sync` |
| Verificar email | GET | `/api/auth/verify-email?token=...` |
| Reenviar verificación | POST | `/api/auth/resend-verification` |
| Recuperar contraseña | POST | `/api/auth/forgot-password` |
| Cambiar contraseña | POST | `/api/auth/reset-password` |
| Renovar sesión | POST | `/api/auth/refresh` |
| Cerrar sesión | POST | `/api/auth/logout` |
| Datos del usuario | GET | `/api/auth/me` |
| Pago premium (Wompi) | POST | `/api/pagos/premium` |

---

## 🎨 Vista Previa de la Interfaz (Mockups)
¿Quieres ver cómo luce la plataforma en acción? Explora los diseños de la interfaz para versiones de escritorio y dispositivos móviles:
👉 **[Ver todos los Mockups del Proyecto](MOCKUPS.md)**
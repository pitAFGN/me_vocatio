# 💎 MeVocatio — Frontend

Aplicación web de orientación profesional desarrollada con **Next.js 16** y **React 19**, permite a los usuarios registrarse, iniciar sesión, explorar áreas vocacionales y acceder a diagnósticos de carrera.

---

## Tecnologías

| Paquete | Uso |
|---|---|
| Next.js 16 | Framework React con App Router y SSR |
| React 19 | Librería de interfaces de usuario |
| Tailwind CSS 4 | Estilos utilitarios |
| Framer Motion | Animaciones del carrusel de opiniones |
| Lucide React | Íconos |
| SweetAlert2 | Alertas y modales de confirmación |

---

## Estructura

```
src/
├── app/                        # Enrutamiento de Next.js (App Router)
│   ├── layout.js               # Layout global con Navbar
│   ├── globals.css             # Estilos globales
│   ├── page.js                 # → re-exporta pages/Home.js
│   ├── login/page.js           # → re-exporta pages/Login.js
│   ├── dashboard/page.js       # → re-exporta pages/Dashboard.js
│   ├── nosotros/page.js        # → re-exporta pages/Nosotros.js
│   ├── reset-password/page.js  # → re-exporta pages/ResetPassword.js
│   └── vocacion/[id]/page.js   # Detalle dinámico de vocación
│
├── pages/                      # Pantallas principales (lógica real)
│   ├── Home.js                 # Landing page
│   ├── Login.js                # Login y registro en un mismo formulario
│   ├── Dashboard.js            # Selección de área vocacional
│   ├── Nosotros.js             # Página institucional
│   └── ResetPassword.js        # Cambio de contraseña con token
│
├── components/                 # Componentes reutilizables
│   ├── ModalOlvidePassword.js  # Modal de recuperación de contraseña
│   ├── NavbarProfile.js        # Burbuja de perfil de usuario autenticado
│   └── OpinionesCarrusel.js    # Carrusel animado de testimonios
│
├── hooks/                      # Lógica reutilizable
│   ├── useAuth.js              # Login, registro, logout, recuperación
│   └── useRouteGuard.js        # Protección de rutas públicas y privadas
│
├── services/                   # Llamadas a la API
│   └── auth.service.js         # Fetch centralizado de todos los endpoints de auth
│
└── lib/                        # Utilidades
    ├── constants.js            # URL base de la API (NEXT_PUBLIC_API_URL)
    └── validarPassword.js      # Regex de validación de contraseña
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/SamuelMoreno19/mevocatio2
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores reales
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Comandos

```bash
# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Iniciar en producción (requiere build previo)
npm start

# Linter
npm run lint
```

La aplicación corre por defecto en `http://localhost:3000`.

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing page |
| `/nosotros` | Público | Página institucional |
| `/login` | Público | Iniciar sesión o registrarse |
| `/login?mode=signup` | Público | Abre directamente el formulario de registro |
| `/reset-password?token=...` | Público | Cambiar contraseña con token del correo |
| `/dashboard` | Privado | Selección de área vocacional |
| `/vocacion/[id]` | Privado | Detalle y diagnóstico de una vocación |

---

## Flujo de autenticación

```
Usuario ingresa credenciales
        │
        ├── useAuth.login()
        ├── authService.login()     ← llama a POST /api/auth/login
        ├── Guarda token en localStorage
        └── Redirige a /dashboard

Al entrar a ruta privada
        │
        └── useProtectedRoute()
              ├── Lee token de localStorage
              ├── Sin token → redirige a /login
              └── Con token → permite el acceso

Al entrar a ruta pública (login, landing)
        │
        └── usePublicRoute()
              ├── Lee token de localStorage
              ├── Con token → redirige a /dashboard
              └── Sin token → permite el acceso
```

---

## Componentes principales

### `useAuth` — Hook de autenticación
Centraliza toda la lógica de sesión. Los componentes nunca llaman al API directamente.

```js
const { login, register, logout, forgotPassword, resetPassword, getToken } = useAuth();
```

### `authService` — Servicio de API
Único punto de contacto con el backend. Si cambia la URL del API, solo se modifica `lib/constants.js`.

### `NavbarProfile` — Perfil de usuario
Solo se renderiza cuando el usuario está autenticado y se encuentra en `/dashboard` o `/vocacion/*`. Muestra un menú desplegable con acceso a recursos y cierre de sesión.

### `useRouteGuard` — Protección de rutas
Dos hooks: `useProtectedRoute` para rutas privadas y `usePublicRoute` para rutas públicas. Ambos retornan `loading: true` mientras verifican el token para evitar flasheos visuales.

---

## Seguridad implementada

- **Validación por campo** en login y registro con mensajes de error individuales
- **Bloqueo de clic derecho** y atajos de teclado de DevTools (`F12`, `Ctrl+Shift+I`, etc.)
- **Detección de DevTools abierto** — redirige al inicio si se detecta la apertura
- **Botón de submit controlado por React** — el estado `enviando` no depende del atributo `disabled` del HTML, que puede ser removido desde el inspector
- **Errores del backend humanizados** — los mensajes de error del servidor se traducen a mensajes amigables para el usuario

---

## Conexión con el Backend

Toda comunicación con la API pasa por `services/auth.service.js`. La URL base se define en `lib/constants.js` y se puede sobreescribir con la variable de entorno `NEXT_PUBLIC_API_URL`.

| Acción | Método | Endpoint |
|---|---|---|
| Registro | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Recuperar contraseña | POST | `/api/auth/forgot-password` |
| Cambiar contraseña | POST | `/api/auth/reset-password` |
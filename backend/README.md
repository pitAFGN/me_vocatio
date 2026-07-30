# 💎 MeVocatio — Backend

API REST del proyecto MeVocatio, gestiona autenticación de usuarios, recuperación de contraseña y seguridad de acceso.

---

## Tecnologías

| Paquete | Uso |
|---|---|
| Express 5 | Servidor HTTP y enrutamiento |
| PostgreSQL + pg | Base de datos relacional |
| bcryptjs | Hash de contraseñas |
| jsonwebtoken | Generación y verificación de tokens JWT |
| nodemailer | Envío de correos de recuperación |
| helmet | Cabeceras HTTP de seguridad |
| express-rate-limit | Límite de intentos por IP |
| express-validator | Validación y sanitización de inputs |
| swagger-jsdoc + swagger-ui-express | Documentación interactiva de la API |
| dotenv | Variables de entorno |

---

## Estructura

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # Conexión a PostgreSQL
│   │   ├── mailer.js       # Configuración de Nodemailer
│   │   └── swagger.js      # Configuración de Swagger
│   ├── controllers/
│   │   └── auth.controller.js   # Manejo de req/res
│   ├── middlewares/
│   │   ├── rateLimiter.js       # Límite de intentos por ruta
│   │   ├── validarInputs.js     # Validación y sanitización
│   │   └── validarPassword.js   # Reglas de contraseña
│   ├── routes/
│   │   └── auth.routes.js       # Definición de rutas + Swagger docs
│   ├── services/
│   │   └── auth.service.js      # Lógica de negocio
│   └── server.js                # Punto de entrada
├── .env                    # Variables de entorno
├── .env.example            # Plantilla de variables de entorno
├── .gitignore
└── package.json
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/SamuelMoreno19/mevocatio2
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
DATABASE_URL=postgres://usuario:password@host:5432/nombre_db
```

---

## Comandos

```bash
# Desarrollo (reinicio automático con nodemon)
npm run dev

# Producción
npm start
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

Desde ahí puedes probar todos los endpoints directamente en el navegador.

---

## Seguridad implementada

- **Helmet** — agrega cabeceras HTTP que protegen contra XSS, clickjacking y sniffing de contenido
- **Rate limiting** — limita intentos por IP en login, registro y recuperación de contraseña
- **Validación server-side** — todos los inputs se validan y sanitizan antes de llegar al controlador
- **Sanitización** — los campos de texto usan `trim()`, `escape()` y `normalizeEmail()` para eliminar caracteres peligrosos
- **Hash de contraseñas** — bcryptjs con salt de 10 rondas, nunca se guarda la contraseña en texto plano
- **JWT con expiración** — los tokens de sesión expiran en 1 hora, los de recuperación en 15 minutos
- **Body limit** — el servidor rechaza peticiones con body mayor a 10kb

---

## Flujo de la petición

```
Petición HTTP
    │
    ├── rateLimiter      → rechaza si supera el límite de intentos
    ├── validarInputs    → rechaza si los campos son inválidos o peligrosos
    ├── validarPassword  → rechaza si la contraseña no cumple los requisitos
    ├── controller       → maneja req/res
    └── service          → lógica de negocio + acceso a la BD
```

---

# 💎 MeVocatio
### Plataforma web de orientación profesional

MeVocatio es una aplicación web que ayuda a los usuarios a descubrir y explorar su vocación profesional mediante diagnósticos inteligentes, rutas de carrera y orientación personalizada.

---

## Estructura del proyecto

```
mevocatio/
├── frontend/    # Aplicación web en Next.js + React
├── backend/     # API REST en Node.js + Express
└── docs/        # Documentación del proyecto
```

---

## Documentación del proyecto

La carpeta `docs/` contiene todos los documentos oficiales del proyecto:

| Documento | Descripción |
|---|---|
| `ACTA_DE_CONSTITUCION_DEL_PROYECTO.pdf` | Acta de constitución formal del proyecto |
| `Diagramas UML.pdf` | Diagramas de clases, secuencia y casos de uso UML |
| `Documento de casos de uso.pdf` | Descripción detallada de los casos de uso del sistema |
| `Documento de Historias de usuario.pdf` | Historias de usuario del producto |
| `Documento de requerimientos.pdf` | Requerimientos funcionales y no funcionales |
| `Documento Entidad-Relacion.pdf` | Modelo entidad-relación de la base de datos |
| `DOCUMENTO_DE_ALCANCE_MeVOCATIO.pdf` | Alcance, límites y entregables del proyecto |
| `Documento_de_Identificación_StakeHolders_MeVocatio.pdf` | Identificación y análisis de stakeholders |
| `Mockups y o prototipos.pdf` | Mockups y prototipos de la interfaz |

---

## Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion, SweetAlert2 |
| Backend | Node.js, Express 5, PostgreSQL, JWT, Nodemailer, Helmet, express-rate-limit |
| Base de datos | PostgreSQL (Neon) |

---

## Inicialización del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/SamuelMoreno19/mevocatio2
cd mevocatio
```

---

### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales
```

Variables de entorno requeridas en `backend/.env`:

```env
DATABASE_URL=postgres://usuario:password@host:5432/nombre_db
```

Iniciar el servidor:

```bash
npm run dev    # Desarrollo
npm start      # Producción
```

El backend corre en `http://localhost:3001`
Documentación Swagger en `http://localhost:3001/api-docs`

---

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Variables de entorno requeridas en `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Iniciar la aplicación:

```bash
npm run dev    # Desarrollo
npm run build  # Build de producción
npm start      # Producción (requiere build previo)
```

El frontend corre en `http://localhost:3000`

---

## Orden de inicialización recomendado

```
1. Iniciar el backend   →  cd backend  && npm start
2. Iniciar el frontend  →  cd frontend && npm run dev
```

> Asegúrate de que el backend esté corriendo antes de iniciar el frontend, ya que la aplicación necesita la API para funcionar.

---

## Repositorio

```
https://github.com/SamuelMoreno19/mevocatio2
```
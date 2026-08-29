# Plan de pulido — Frontend MeVocatio

Estado: **aprobado por el usuario** (ronda post-merge del refactor de auth por cookies).
No toca `DiamanteCanvas` (3D/glb), `BackgroundStars` (estrellas) ni el hero de `page.js`.

### Progreso

- [x] **A1 — LoadingScreen:** `frontend/src/components/LoadingScreen.jsx` + uso en
  `dashboard`, `configuracion`, `favoritos`, `insignias` y estados de `diagnostico/[id]`.
- [x] **A2 — DashboardLayout:** `frontend/src/components/DashboardLayout.jsx` (recibe
  `logout`, `mainClassName`, `fondoClassName` y `decoracion`) usado en `dashboard`,
  `favoritos` e `insignias`.
- [x] **A3 — ProfessionCard:** `frontend/src/components/ProfessionCard.js` (mapeo
  `title|nombre`, `desc|descripcion`, `area|categoria`, `slug|id`, `useFavorites` interno,
  `showTest` para el botón "Iniciar Test con IA"). `VocacionCard.js` eliminado y
  `DashboardHome` sin props de favoritos/router.
- [x] **B — Carga inicial:** `<link rel="preload" href="/diamante.glb" as="fetch">` (emitido por
  Next en el `<head>`, sin `<head>` manual en `layout.js`).
- [x] **Perf — Sesión no bloqueante:** `auth.service.js` con `fetchConTimeout` (6 s, AbortController)
  en `me`/`refresh` y dedupe de `me()` (un solo request en vuelo compartido por Navbar + guards).
  Evita que el dashboard se quede en "Verificando acceso..." si el backend cuelga.
- [x] **Perf — Dedupe three.js:** `ThreeScene.jsx` unifica `DiamanteCanvas` + `BackgroundStars` en un
  solo loadable → la landing descarga UN chunk de three (~0.94 MB) en vez de dos (~1.75 MB), lazy.
- [x] **Layout dashboard:** contenedor en bloque (sin `flex`) para que `max-w-7xl mx-auto` centre el
  contenido; `flex` solo en favoritos/insignias vía `containerClassName`.

### Medición de carga (local)

| Caso | HTML | Chunk diamante (944 KB) |
|---|---|---|
| Dev frío (1.ª visita) | ~5 s | ~15-20 s (compila three.js on-demand) |
| Dev caliente | ~80 ms | instantáneo (cacheado) |
| Producción (`npm start`) | ~60 ms | ~400 ms |

La "bolita" de 15-20 s es la compilación dev del chunk 3D en el primer vistazo tras
arrancar el servidor; no existe en producción. Probar con `npm run review`.

## A1 — LoadingScreen único

El bloque "Verificando acceso..." está copiado en `configuracion:23`, `favoritos:18`,
`insignias:44` y `dashboard` devuelve `null`. Se extrae un componente `LoadingScreen`
(texto y clases configurables) y se usa en las 4 páginas protegidas + los estados de
carga/error de `diagnostico/[id]`.

## A2 — DashboardLayout compartido

`dashboard`, `favoritos` e `insignias` repiten el mismo esqueleto:
`<div min-h bg...><SidebarNav/><main md:pl-64 ...>`.
Se extrae `DashboardLayout` que centraliza: contenedor exterior, decoración (glows),
`SidebarNav` (recibe `logout`) y `<main className={mainClassName}>`. Cada página conserva
su espaciado pasando su `mainClassName` / `fondoClassName` según corresponda.

## A3 — ProfessionCard unificado

`DashboardHome` (tarjeta inline, ~33 líneas) y `VocacionCard` son casi la misma tarjeta:
badge de área, bookmark, título/desc, "Ver Módulo / Ruta".
Un solo `ProfessionCard` con:
- mapeo `title|nombre`, `desc|descripcion`, `area|categoria`, `slug|id`
- "Ver Módulo / Ruta" → `/vocacion/{slug}`
- "Iniciar Test con IA" (solo vía prop `showTest`) → `/diagnostico/{slug}`
- `useFavorites` interno (elimina el plumb de `savedIds`/`toggleSave` por props)

Se elimina `VocacionCard.js` (reemplazado) y los imports sobrantes de `DashboardHome`.

## B — Carga inicial

- `preload` del `/diamante.glb` en el `<head>` del layout (`<link rel="preload" as="fetch">`),
  no invasivo: solo descarga el asset durante el parse; el 3D no cambia.
- Verificar: `npm run lint`, `npm test`, `npm run build` y medir `npm start`.

## Checklist de verificación final

- [x] `npm run lint` sin errores
- [x] `npm test` en verde (45 tests)
- [x] `npm run build` sin errores
- [ ] Smoke test: login (email + Google) → dashboard → /favoritos → Iniciar Test IA
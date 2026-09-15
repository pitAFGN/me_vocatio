/**
 * Middleware de defensa CSRF basado en verificación de Origin.
 *
 * Las cookies de sesión (SameSite=None en producción) viajan en peticiones
 * cross-site, así que un formulario malicioso podría disparar acciones de
 * estado con la sesión de la víctima. Cualquier navegador envía el header
 * `Origin` en peticiones POST/PUT/DELETE/PATCH cross-site; si ese origen no
 * está en la lista blanca, la petición se rechaza antes de tocar estado.
 *
 * Peticiones sin `Origin` (curl, webhooks firmados, clientes no-navegador)
 * se permiten; esos clientes no pueden forzar a un navegador a adjuntar
 * cookies de la víctima.
 *
 * @param {string[]} allowedOrigins Lista de orígenes permitidos.
 * @param {{bypassPaths?: string[]}} [opciones]
 */
const csrfOrigin = (allowedOrigins, opciones = {}) => {
  const bypassPaths = opciones.bypassPaths || [];

  return (req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return next();
    }

    if (bypassPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const origin = req.headers.origin;

    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: "Origen no permitido" });
    }

    next();
  };
};

module.exports = csrfOrigin;
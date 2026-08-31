const { verifyAccessToken } = require('../utils/jwt');
const { getAuthCookies, ACCESS_COOKIE } = require('../utils/authCookies');

const authenticateToken = (req, res, next) => {
  // El token viene desde el frontend en el header: "Authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || getAuthCookies(req)[ACCESS_COOKIE];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(decoded.id))) {
      return res.status(401).json({ message: 'Sesión antigua o inválida. Inicia sesión nuevamente.' });
    }
    req.user = decoded; // Guardamos los datos del usuario en req.user
    next(); // Permite el paso al controlador correspondiente
  } catch (error) {
    return res.status(403).json({ message: 'Token de acceso inválido o expirado.' });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || getAuthCookies(req)[ACCESS_COOKIE];

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      if (decoded && decoded.id) {
        req.user = decoded;
      }
    } catch {
      // Ignora error si el token expiró o es inválido en modo opcional
    }
  }
  next();
};

authenticateToken.authenticateToken = authenticateToken;
authenticateToken.optionalAuth = optionalAuth;

module.exports = authenticateToken;
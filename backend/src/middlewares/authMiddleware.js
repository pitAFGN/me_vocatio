const pool = require('../config/db');
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

const requirePremium = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Autenticación requerida.' });
  }

  try {
    const result = await pool.query('SELECT plan FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const userPlan = (result.rows[0].plan || 'free').toLowerCase();
    if (userPlan !== 'premium') {
      return res.status(403).json({ 
        message: 'Esta función es exclusiva para usuarios con suscripción al Plan Premium.',
        code: 'PREMIUM_REQUIRED'
      });
    }

    req.user.plan = 'premium';
    next();
  } catch (error) {
    console.error('Error al verificar plan de usuario:', error);
    return res.status(500).json({ message: 'Error al verificar permisos de suscripción.' });
  }
};

authenticateToken.authenticateToken = authenticateToken;
authenticateToken.optionalAuth = optionalAuth;
authenticateToken.requirePremium = requirePremium;

module.exports = authenticateToken;
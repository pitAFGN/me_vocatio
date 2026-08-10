const { verifyAccessToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  // El token viene desde el frontend en el header: "Authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Guardamos los datos del usuario en req.user
    next(); // Permite el paso al controlador correspondiente
  } catch (error) {
    return res.status(403).json({ message: 'Token de acceso inválido o expirado.' });
  }
};

module.exports = authenticateToken;   
const jwt = require('jsonwebtoken');
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)) {
    throw new Error('FATAL: JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben estar configurados en producción.');
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'mevocatio_dev_access_secret_only';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'mevocatio_dev_refresh_secret_only';

/**
 * Genera un Access Token de corta duración (15m)
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });
};

/**
 * Genera un Refresh Token de larga duración (7d)
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

/**
 * Verifica la validez del Access Token
 */
const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

/**
 * Verifica la validez del Refresh Token
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
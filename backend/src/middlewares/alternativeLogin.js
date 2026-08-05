const { createClient } = require('@supabase/supabase-js');
const authService = require('../services/auth.service');

// Inicializar el cliente de Supabase para el backend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const verificarTokenSupabase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ No llegó el header Authorization o no tiene Bearer");
      return res.status(401).json({ message: 'Token de acceso no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    console.log("🔍 Token recibido en el back:", token.substring(0, 20) + "...");

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log("❌ ERROR DEVUELTO POR SUPABASE:", error); // <-- ¡MIRA ESTE LOG EN TU TERMINAL!
      return res.status(401).json({ message: 'Token de Supabase inválido o expirado.' });
    }

    req.supabaseUser = user;
    next();
  } catch (err) {
    console.error('Error en el middleware alternativeLogin:', err);
    return res.status(500).json({ message: 'Error interno al validar el acceso alternativo.' });
  }
};

module.exports = {
  verificarTokenSupabase
};
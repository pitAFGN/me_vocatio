const authService = require("../services/auth.service");
const { setAuthCookies } = require("../utils/authCookies");

const googleSyncController = async (req, res) => {
  try {
    const supabaseUser = req.supabaseUser; // Obtenido del middleware de Supabase
    const email = supabaseUser.email;

    const nombre =
      req.body?.name ||
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      email?.split("@")[0] ||
      "Usuario";

    // Llamamos al servicio para encontrar o registrar al usuario y obtener su JWT
    const { accessToken, refreshToken, user } = await authService.encontrarOCrearUsuarioGoogle(email, nombre);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Sincronización con Google exitosa",
      user
    });
  } catch (error) {
    console.error("Error al procesar el login con Google:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Error interno al procesar el acceso con Google."
    });
  }
};

module.exports = { googleSyncController };
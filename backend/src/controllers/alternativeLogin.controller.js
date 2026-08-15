const authService = require("../services/auth.service");

const googleSyncController = async (req, res) => {
  try {
    const user = req.supabaseUser; // Obtenido del middleware de Supabase
    const email = user.email;

    const nombre =
      req.body?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email?.split("@")[0] ||
      "Usuario";

    // Llamamos al servicio para encontrar o registrar al usuario y obtener su JWT
    const { token } = await authService.encontrarOCrearUsuarioGoogle(email, nombre);

    return res.status(200).json({
      message: "Sincronización con Google exitosa",
      token
    });
  } catch (error) {
    console.error("Error al procesar el login con Google:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Error interno al procesar el acceso con Google."
    });
  }
};

module.exports = { googleSyncController };
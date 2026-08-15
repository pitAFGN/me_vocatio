const verificarCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({
      error: "Por favor, completa la validación del reCAPTCHA.",
    });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("Falta RECAPTCHA_SECRET_KEY en el archivo .env");
    return res.status(500).json({
      error: "Error de configuración del servidor al verificar el captcha.",
    });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", captchaToken);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        error:
          "Fallo en la validación de seguridad del reCAPTCHA. Inténtalo de nuevo.",
      });
    }

    // Si es válido, pasa al siguiente middleware o controlador
    next();
  } catch (error) {
    console.error("Error al conectar con la API de Google reCAPTCHA:", error);
    return res.status(500).json({
      error: "Error interno al verificar la seguridad del captcha.",
    });
  }
};

module.exports = { verificarCaptcha };

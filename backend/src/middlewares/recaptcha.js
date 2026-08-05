const verificarCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ 
      message: "Por favor, completa la validación del reCAPTCHA." 
    });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`,
      { method: "POST" }
    );
    
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ 
        message: "Fallo en la validación de seguridad del reCAPTCHA. Inténtalo de nuevo." 
      });
    }

    // Si es válido, pasa al siguiente middleware o controlador
    next();
  } catch (error) {
    console.error("Error al conectar con la API de Google reCAPTCHA:", error);
    return res.status(500).json({ 
      message: "Error interno al verificar la seguridad del captcha." 
    });
  }
};

module.exports = { verificarCaptcha };
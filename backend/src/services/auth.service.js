const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const transporter = require("../config/mailer");
const { generarTokenSeguro, hashearToken, calcularExpiracion } = require("../utils/tokens");
require("dotenv").config();

// Se mantiene el fallback para no romper entornos ya desplegados,
// pero en producción SIEMPRE debe definirse JWT_SECRET en el .env.
const SECRET = process.env.JWT_SECRET || "mevocatio_secret";

// Horas de validez del enlace de verificación de correo (magic link)
const EMAIL_VERIFICATION_EXPIRES_HOURS =
  Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS) || 24;

/* ─────────────────────────────────────────
   REGISTER
───────────────────────────────────────── */
const register = async (name, email, password) => {
  const existe = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existe.rows.length > 0) {
    throw { status: 409, message: "El correo ya está registrado" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const resultado = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );

  const usuario = resultado.rows[0];

  // Generamos el magic link de verificación y lo enviamos por correo.
  // Si el envío falla, no revertimos el registro: el usuario ya existe
  // y puede solicitar un reenvío con /resend-verification.
  try {
    await enviarCorreoVerificacion(usuario.id, usuario.email, usuario.name);
  } catch (error) {
    console.error("Error enviando correo de verificación:", error.message);
  }

  return {
    ...usuario,
    message:
      "Usuario creado exitosamente. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.",
  };
};

/* ─────────────────────────────────────────
   Helper interno: genera el token, lo guarda
   hasheado en BD y envía el magic link.
───────────────────────────────────────── */
const enviarCorreoVerificacion = async (userId, email, name) => {
  const token = generarTokenSeguro();
  const tokenHash = hashearToken(token);
  const expira = calcularExpiracion(EMAIL_VERIFICATION_EXPIRES_HOURS);

  await pool.query(
    "UPDATE users SET verification_token_hash = $1, verification_token_expires = $2 WHERE id = $3",
    [tokenHash, expira, userId]
  );

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"MeVocatio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifica tu correo electrónico",
    html: `
      <div style="font-family:sans-serif;">
        <h2>¡Bienvenido a MeVocatio${name ? `, ${name}` : ""}!</h2>
        <p>Confirma tu correo electrónico haciendo clic en el botón. El enlace expira en ${EMAIL_VERIFICATION_EXPIRES_HOURS} horas.</p>
        <a href="${verifyLink}"
           style="background:#1e293b;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Verificar mi correo
        </a>
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
      </div>
    `,
  });
};

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
const login = async (email, password) => {
  const resultado = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (resultado.rows.length === 0) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  const user = resultado.rows[0];
  const passwordValida = await bcrypt.compare(password, user.password_hash);

  if (!passwordValida) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  if (!user.email_verified) {
    throw {
      status: 403,
      message: "Debes verificar tu correo electrónico antes de iniciar sesión.",
    };
  }

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

  return { token };
};

/* ─────────────────────────────────────────
   FORGOT PASSWORD
───────────────────────────────────────── */
const forgotPassword = async (email) => {
  const resultado = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

  if (resultado.rows.length === 0) {
    throw { status: 404, message: "El correo no está registrado" };
  }

  const token = jwt.sign({ id: resultado.rows[0].id }, SECRET, { expiresIn: "15m" });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"MeVocatio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperar contraseña",
    html: `
      <div style="font-family:sans-serif;">
        <h2>Recuperar contraseña</h2>
        <p>Haz clic en el botón para cambiar tu contraseña. El enlace expira en 15 minutos.</p>
        <a href="${resetLink}"
            style="background:#1e293b;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Cambiar contraseña
        </a>
      </div>
    `,
  });
};

/* ─────────────────────────────────────────
   RESET PASSWORD
───────────────────────────────────────── */
const resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch {
    throw { status: 400, message: "Token inválido o expirado" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    hashedPassword,
    decoded.id,
  ]);
};

/* ─────────────────────────────────────────
   VERIFY EMAIL (Magic Link)
───────────────────────────────────────── */
const verifyEmail = async (token) => {
  if (!token) {
    throw { status: 400, message: "Token no proporcionado" };
  }

  const tokenHash = hashearToken(token);

  const resultado = await pool.query(
    "SELECT id, email, email_verified, verification_token_expires FROM users WHERE verification_token_hash = $1",
    [tokenHash]
  );

  if (resultado.rows.length === 0) {
    // El token no existe: o nunca existió, o ya fue usado
    // (se borra automáticamente al verificar), o el usuario
    // pidió uno nuevo y este quedó invalidado.
    throw { status: 400, message: "El enlace es inválido o ya fue utilizado." };
  }

  const user = resultado.rows[0];

  if (user.email_verified) {
    throw { status: 400, message: "Este correo ya ha sido verificado." };
  }

  if (new Date(user.verification_token_expires) < new Date()) {
    throw {
      status: 400,
      message: "El enlace ha expirado. Solicita uno nuevo para verificar tu correo.",
    };
  }

  // Se marca como verificado y se invalida el token (enlace de un solo uso)
  await pool.query(
    `UPDATE users
     SET email_verified = true,
         email_verified_at = NOW(),
         verification_token_hash = NULL,
         verification_token_expires = NULL
     WHERE id = $1`,
    [user.id]
  );

  return { email: user.email };
};

/* ─────────────────────────────────────────
   RESEND VERIFICATION
───────────────────────────────────────── */
const resendVerification = async (email) => {
  const resultado = await pool.query(
    "SELECT id, name, email, email_verified FROM users WHERE email = $1",
    [email]
  );

  if (resultado.rows.length === 0) {
    throw { status: 404, message: "El correo no está registrado" };
  }

  const user = resultado.rows[0];

  if (user.email_verified) {
    throw { status: 400, message: "Este correo ya ha sido verificado." };
  }

  // Genera un nuevo token y sobrescribe el anterior:
  // esto invalida automáticamente cualquier enlace previo sin usar.
  await enviarCorreoVerificacion(user.id, user.email, user.name);
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
};

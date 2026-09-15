const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const transporter = require("../config/mailer");
const { generarTokenSeguro, hashearToken, calcularExpiracion } = require("../utils/tokens");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

require("dotenv").config();

// Horas de validez del enlace de verificación de correo (magic link)
const EMAIL_VERIFICATION_EXPIRES_HOURS =
  Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS) || 24;

/* ─────────────────────────────────────────
   REGISTER
   Respuesta genérica (anti-enumeración): no revela si el correo ya
   estaba registrado. Si el email existe, responde igual que un registro
   nuevo para no permitir mapear cuentas (M3).
───────────────────────────────────────── */
const register = async (name, email, password) => {
  const existe = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existe.rows.length > 0) {
    return {
      id: null,
      email: null,
      message:
        "Si el correo no estaba registrado, revisa tu bandeja para confirmar tu cuenta antes de iniciar sesión.",
      emailSent: null,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const resultado = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
    [name, email, hashedPassword]
  );

  const usuario = resultado.rows[0];

  let emailSent = true;
  try {
    await enviarCorreoVerificacion(usuario.id, usuario.email, usuario.name);
  } catch (error) {
    emailSent = false;
    console.error("Error enviando correo de verificación:", error.message);
  }

  return {
    ...usuario,
    emailSent,
    message:
      "Usuario creado exitosamente. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.",
  };
};

/* ─────────────────────────────────────────
   Helper interno: correo verificación
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
   LOGIN (ACTUALIZADO PARA REFRESH TOKEN)
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

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp || 0,
      level: user.level || 1,
      current_streak: user.current_streak || 0
    },
  };
};


/* ─────────────────────────────────────────
   FORGOT PASSWORD
───────────────────────────────────────── */
const forgotPassword = async (email) => {
  const resultado = await pool.query("SELECT id, name FROM users WHERE email = $1", [email]);

  // Anti-enumeración (M3): si el correo no existe, se responde igual que
  // cuando sí existe (mensaje genérico), sin distinguir códigos ni mensajes.
  if (resultado.rows.length === 0) {
    return { sent: false, reason: "email_not_found" };
  }

  const user = resultado.rows[0];
  const rawToken = generarTokenSeguro();
  const tokenHash = hashearToken(rawToken);
  // Expiración en 15 minutos
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    `UPDATE users 
     SET reset_password_token_hash = $1, reset_password_token_expires = $2 
     WHERE id = $3`,
    [tokenHash, expires, user.id]
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  try {
    await transporter.sendMail({
      from: `"MeVocatio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperar contraseña",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Recuperar contraseña</h2>
          <p>Hola${user.name ? ` ${user.name}` : ""}, haz clic en el botón para cambiar tu contraseña. El enlace expira en 15 minutos y solo puede ser usado una vez.</p>
          <a href="${resetLink}"
             style="background:#1e293b;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
             Cambiar contraseña
          </a>
          <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando correo de recuperación:", error.message);
    // M4: no silenciar el fallo; el usuario debe poder reintentar.
    throw { status: 502, message: "No se pudo enviar el correo de recuperación. Inténtalo de nuevo." };
  }

  return { sent: true };
};

/* ─────────────────────────────────────────
   RESET PASSWORD
───────────────────────────────────────── */
const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw { status: 400, message: "Token no proporcionado" };
  }

  const tokenHash = hashearToken(token);

  const resultado = await pool.query(
    `SELECT id, email, reset_password_token_expires 
     FROM users 
     WHERE reset_password_token_hash = $1`,
    [tokenHash]
  );

  if (resultado.rows.length === 0) {
    throw { status: 400, message: "El enlace de recuperación es inválido o ya fue utilizado." };
  }

  const user = resultado.rows[0];

  if (new Date(user.reset_password_token_expires) < new Date()) {
    await pool.query(
      `UPDATE users 
       SET reset_password_token_hash = NULL, reset_password_token_expires = NULL 
       WHERE id = $1`,
      [user.id]
    );
    throw { status: 400, message: "El enlace de recuperación ha expirado. Solicita uno nuevo." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizamos contraseña e INVALIDAMOS el token de un solo uso inmediatamente
  await pool.query(
    `UPDATE users 
     SET password_hash = $1, reset_password_token_hash = NULL, reset_password_token_expires = NULL 
     WHERE id = $2`,
    [hashedPassword, user.id]
  );
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

  await pool.query(
    `UPDATE users
     SET email_verified = true,
         email_verified_at = NOW(),
         verification_token_hash = NULL,
         verification_token_expires = NULL
     WHERE id = $1`,
    [user.id]
  );

  return { userId: user.id, email: user.email };
};

/* ─────────────────────────────────────────
   RESEND VERIFICATION
───────────────────────────────────────── */
const resendVerification = async (email) => {
  const resultado = await pool.query(
    "SELECT id, name, email, email_verified FROM users WHERE email = $1",
    [email]
  );

  // Anti-enumeración (M3): mismas respuestas genéricas para todos los casos.
  if (resultado.rows.length === 0 || resultado.rows[0].email_verified) {
    return { sent: false };
  }

  const user = resultado.rows[0];

  try {
    await enviarCorreoVerificacion(user.id, user.email, user.name);
  } catch (error) {
    console.error("Error reenviando correo de verificación:", error.message);
    throw { status: 502, message: "No se pudo enviar el correo de verificación. Inténtalo de nuevo." };
  }

  return { sent: true };
};

/* ─────────────────────────────────────────
   GOOGLE SYNC (LOGIN / REGISTER ALTERNATIVO)
───────────────────────────────────────── */
const encontrarOCrearUsuarioGoogle = async (email, name) => {
  let resultado = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  let user;

  if (resultado.rows.length > 0) {
    user = resultado.rows[0];
    if (!user.email_verified) {
      await pool.query(
        "UPDATE users SET email_verified = true, email_verified_at = NOW() WHERE id = $1",
        [user.id]
      );
      user.email_verified = true;
    }
  } else {
    const nuevoUsuario = await pool.query(
      "INSERT INTO users (name, email, password_hash, email_verified, email_verified_at) VALUES ($1, $2, $3, true, NOW()) RETURNING id, name, email, plan, xp, level, current_streak, role",
      [name, email, ""]
    );
    user = nuevoUsuario.rows[0];
  }

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

  return {
    accessToken,
    refreshToken,
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      role: user.role,
      plan: user.plan || "free",
      xp: user.xp || 0,
      level: user.level || 1,
      current_streak: user.current_streak || 0
    },
  };
};

// Exportamos todas las funciones juntas de manera correcta
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  encontrarOCrearUsuarioGoogle,
};

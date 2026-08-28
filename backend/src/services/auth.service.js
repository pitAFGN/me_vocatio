const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const pool = require("../config/db");
const transporter = require("../config/mailer");
const { generarTokenSeguro, hashearToken, calcularExpiracion } = require("../utils/tokens");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

require("dotenv").config();

// Mantenemos la clave por si acaso para forgotPassword/resetPassword
const SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "mevocatio_secret";

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

  const payload = { id: user.id, email: user.email, name: user.name };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
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

  if (resultado.rows.length === 0) {
    throw { status: 404, message: "El correo no está registrado" };
  }

  const user = resultado.rows[0];

  if (user.email_verified) {
    throw { status: 400, message: "Este correo ya ha sido verificado." };
  }

  await enviarCorreoVerificacion(user.id, user.email, user.name);
};

/* ─────────────────────────────────────────
   GOOGLE SYNC (LOGIN / REGISTER ALTERNATIVO)
───────────────────────────────────────── */
const encontrarOCrearUsuarioGoogle = async (email, name) => {
  let resultado = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  let user;

  if (resultado.rows.length > 0) {
    user = resultado.rows[0];
  } else {
    const nuevoUsuario = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, ""]
    );
    user = nuevoUsuario.rows[0];
  }

  const payload = { id: user.id, email: user.email, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
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

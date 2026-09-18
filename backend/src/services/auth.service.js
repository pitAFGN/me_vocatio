const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const transporter = require("../config/mailer");
const { generarTokenSeguro, hashearToken, calcularExpiracion } = require("../utils/tokens");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

require("dotenv").config();
const dns = require("dns").promises;

// Horas de validez del enlace de verificación de correo (magic link)
const EMAIL_VERIFICATION_EXPIRES_HOURS =
  Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS) || 24;

const normalizarNombreRegistro = (name) => {
  const nombre = String(name || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("es");
  if (!nombre) return nombre;

  return nombre
    .split(" ")
    .map((palabra) => palabra.charAt(0).toLocaleUpperCase("es") + palabra.slice(1))
    .join(" ");
};

const normalizarEmail = (email) => {
  if (!email) return email;
  email = String(email).trim().toLowerCase();
  const partes = email.split("@");
  if (partes.length !== 2) return email;
  let [local, dominio] = partes;
  if (dominio === "gmail.com" || dominio === "googlemail.com") {
    local = local.replace(/\./g, "");
  }
  return `${local}@${dominio}`;
};

const actualizarNombre = async (userId, name) => {
  const nombreNormalizado = normalizarNombreRegistro(name);
  const resultado = await pool.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, plan, role",
    [nombreNormalizado, userId]
  );
  return resultado.rows[0] || null;
};

/* ─────────────────────────────────────────
   REGISTER
   Si el email existe, lanza 409 (UX > Anti-enumeración).
───────────────────────────────────────── */
const register = async (name, email, password) => {
  email = normalizarEmail(email);
  const nombreNormalizado = normalizarNombreRegistro(name);
  const existe = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existe.rows.length > 0) {
    throw { status: 409, message: "El correo ya está registrado en el sistema." };
  }

  // Verificar que el dominio del correo realmente exista (MX records)
  const dominio = email.split("@")[1];
  if (!dominio) {
    throw { status: 400, message: "El correo electrónico no tiene un formato válido." };
  }

  try {
    const mxRecords = await dns.resolveMx(dominio);
    // RFC 7505: un registro MX nulo ("0 .") o la ausencia de MX significan
    // explícitamente que el dominio no recibe correo.
    const noRecibeCorreo =
      !mxRecords ||
      mxRecords.length === 0 ||
      mxRecords.every((r) => !r.exchange || r.exchange === ".");
    if (noRecibeCorreo) {
      throw { status: 400, message: `El dominio "${dominio}" no parece recibir correos. Verifica que tu email esté bien escrito.` };
    }
  } catch (err) {
    if (err.status === 400) throw err;
    // Errores de resolución transitorios (resolver lento/caído, timeout, etc.):
    // no se bloquea el registro, solo se avisa para que nadie quede fuera por
    // un problema temporal de DNS.
    const codigo = String(err?.code || "");
    const ES_TRANSITORIO = [
      "EAI_AGAIN",      // resolver temporalmente no disponible
      "ETIMEOUT",       // la consulta DNS tardó demasiado
      "ESERVFAIL",      // el servidor DNS falló al responder
      "ECONNREFUSED",   // el servidor DNS rechazó la conexión
      "ENETDOWN",       // red caída
      "ENETUNREACH",    // red inalcanzable
      "EHOSTUNREACH",   // el servidor DNS no responde
    ].includes(codigo);
    if (ES_TRANSITORIO) {
      console.warn(`[MX] No se pudo verificar el dominio "${dominio}" (${codigo}); se continúa el registro.`);
    } else {
      // ENOTFOUND, ENODATA, EAI_NONAME, etc. = el dominio no existe/no resuelve
      throw { status: 400, message: `El dominio "${dominio}" no existe. ¿Escribiste bien tu correo?` };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const resultado = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
    [nombreNormalizado, email, hashedPassword]
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
    subject: "Verifica tu correo electrónico — MeVocatio",
    html: `
      <div style="font-family:Segoe UI, Arial, sans-serif; background:#0f172a; padding:40px 20px;">
        <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
          <div style="background:#0f172a; padding:28px 32px; text-align:center;">
            <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">MeVocatio</span>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#0f172a; margin:0 0 12px;">¡Bienvenido${name ? `, ${name}` : ""}! 👋</h2>
            <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 24px;">
              Gracias por unirte a MeVocatio. Confirma tu correo electrónico para activar tu cuenta y empezar a descubrir tu camino vocacional.
            </p>
            <div style="text-align:center; margin:0 0 24px;">
              <a href="${verifyLink}"
                 style="background:#8b5cf6; color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px; display:inline-block;">
                 Verificar mi correo
              </a>
            </div>
            <p style="color:#94a3b8; font-size:13px; line-height:1.5; margin:0;">
              Este enlace expira en ${EMAIL_VERIFICATION_EXPIRES_HOURS} horas. Si no creaste esta cuenta, puedes ignorar este mensaje con confianza.
            </p>
          </div>
        </div>
        <p style="text-align:center; color:#64748b; font-size:12px; margin-top:20px;">
          MeVocatio — Orientación vocacional para encontrar tu camino
        </p>
      </div>
    `,
  });
};

/* ─────────────────────────────────────────
   LOGIN (ACTUALIZADO PARA REFRESH TOKEN)
───────────────────────────────────────── */
const login = async (email, password) => {
  email = normalizarEmail(email);
  const resultado = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (resultado.rows.length === 0) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  const user = resultado.rows[0];

  // Cuentas creadas únicamente con Google no tienen contraseña: no se puede
  // comparar bcrypt contra un hash vacío (eso lanzaba un error 500).
  if (!user.password_hash) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  const passwordValida = await bcrypt.compare(password, user.password_hash);

  if (!passwordValida) {
    throw { status: 401, message: "Credenciales inválidas" };
  }

  if (!user.email_verified) {
    // Misma respuesta genérica que para credenciales inválidas (anti-enumeración):
    // no se revela que el correo existe pero aún no está verificado.
    throw { status: 401, message: "Credenciales inválidas" };
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
  email = normalizarEmail(email);
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
      subject: "Recuperar contraseña — MeVocatio",
      html: `
        <div style="font-family:Segoe UI, Arial, sans-serif; background:#0f172a; padding:40px 20px;">
          <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
            <div style="background:#0f172a; padding:28px 32px; text-align:center;">
              <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">MeVocatio</span>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#0f172a; margin:0 0 12px;">Recuperar contraseña 🔒</h2>
              <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 24px;">
                Hola${user.name ? ` ${user.name}` : ""}, recibimos una solicitud para cambiar tu contraseña. Haz clic en el botón para crear una nueva.
              </p>
              <div style="text-align:center; margin:0 0 24px;">
                <a href="${resetLink}"
                   style="background:#8b5cf6; color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px; display:inline-block;">
                   Cambiar contraseña
                </a>
              </div>
              <p style="color:#94a3b8; font-size:13px; line-height:1.5; margin:0;">
                Este enlace expira en 15 minutos y solo puede usarse una vez. Si no solicitaste este cambio, puedes ignorar este mensaje con confianza.
              </p>
            </div>
          </div>
          <p style="text-align:center; color:#64748b; font-size:12px; margin-top:20px;">
            MeVocatio — Orientación vocacional para encontrar tu camino
          </p>
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

  // Invalidar todas las sesiones activas (refresh tokens) del usuario: después
  // de un cambio de contraseña no debe quedar ninguna sesión previa viva.
  await pool.query(`DELETE FROM sessions WHERE user_id = $1`, [user.id]);
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
  email = normalizarEmail(email);
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
  email = normalizarEmail(email);
  let resultado = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  let user;

  if (resultado.rows.length > 0) {
    user = resultado.rows[0];

    // Si el usuario ya existía (con contraseña) y no estaba verificado, 
    // Google nos confirma que el correo es legítimo. Lo verificamos automáticamente.
    if (!user.email_verified) {
      const actualizado = await pool.query(
        "UPDATE users SET email_verified = true, email_verified_at = NOW() WHERE id = $1 RETURNING *",
        [user.id]
      );
      user = actualizado.rows[0];
    }
    // Account Linking: Permitimos el acceso (el usuario ahora puede entrar con clave o con Google).
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
  actualizarNombre,
  normalizarNombreRegistro,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  encontrarOCrearUsuarioGoogle,
};

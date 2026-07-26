const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const transporter = require("../config/mailer");
require("dotenv").config();

const SECRET = "mevocatio_secret";

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

  return resultado.rows[0];
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

module.exports = { register, login, forgotPassword, resetPassword };

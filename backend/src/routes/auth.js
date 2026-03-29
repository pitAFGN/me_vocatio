const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const SECRET = "mevocatio_secret";

/* =========================
   CONFIG EMAIL
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "MeVocatio.app@gmail.com",
    pass: "yeyt tian gfhb aced"
  }
});

/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    // 🔐 RESPUESTA SEGURA (NO FILTRA USUARIOS)
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "El correo no existe pa, pongase las pilas y registrese" });
    }

    // 🔐 generar token
    const token = jwt.sign(
      { id: user.rows[0].id },
      SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"MeVocatio" <MeVocatio.app@gmail.com>',
      to: email,
      subject: "Recuperar contraseña",
      html: `
    <div style="font-family:sans-serif;">
      <h2>Recuperar contraseña</h2>
      <p>Haz clic en el botón para cambiar tu contraseña:</p>
      <a href="${resetLink}" 
         style="background:#1e293b;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
         Cambiar contraseña
      </a>
    </div>
  `
    });

    res.json({ message: "Correo enviado correctamente" });

    // SIEMPRE RESPONDE LO MISMO
    res.json({ message: "si existe el correo, envie el enlace mijo" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en recuperación" });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash=$1 WHERE id=$2",
      [hashedPassword, decoded.id]
    );

    res.json({ message: "Contraseña actualizada" });

  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
});

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json(newUser.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
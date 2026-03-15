const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "mevocatio_secret";

/* REGISTER */
router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.json(newUser.rows[0]);

  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }

});

/* LOGIN */
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }

});

module.exports = router;
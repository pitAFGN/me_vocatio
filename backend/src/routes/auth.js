const express = require("express");
const router = express.Router();
const pool = require("../db");
/* token */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = "mevocatio_secret";

/* register y la vuelta de encriptacion */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("BODY:", req.body);

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

/* Login y todo eso */
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
      user.rows[0].password_hash
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
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
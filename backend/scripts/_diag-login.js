require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

const run = async () => {
  const email = `diag-${crypto.randomBytes(4).toString("hex")}@test.com`;
  const password = "PruebaSegura123!";
  const hash = bcrypt.hashSync(password, 10);

  const ins = await pool.query(
    `INSERT INTO users (name, email, password_hash, email_verified)
     VALUES ('Diagnóstico Pago', $1, $2, true) RETURNING id, email`,
    [email, hash]
  );
  console.log("USUARIO TEMPORAL:", ins.rows[0].email, "id:", ins.rows[0].id);

  const loginRes = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const loginBody = await loginRes.json().catch(() => ({}));
  console.log("LOGIN STATUS:", loginRes.status);
  console.log("LOGIN BODY:", JSON.stringify(loginBody));

  const setCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [];
  console.log("SET-COOKIE (nº):", setCookies.length);
  setCookies.forEach((c) => {
    const name = c.split("=")[0];
    const attrs = c.split("; ").slice(1).join("; ");
    console.log(`  cookie[${name}] -> atributos: ${attrs}`);
  });

  const cookieHeader = setCookies.map((c) => c.split(";")[0]).join("; ");
  const meRes = await fetch("http://localhost:3001/api/auth/me", {
    headers: { Cookie: cookieHeader },
  });
  const meBody = await meRes.json().catch(() => ({}));
  console.log("ME STATUS con cookie:", meRes.status);
  console.log("ME BODY:", JSON.stringify(meBody).slice(0, 300));

  await pool.query("DELETE FROM users WHERE id = $1", [ins.rows[0].id]);
  console.log("USUARIO TEMPORAL ELIMINADO");
};

run()
  .catch((e) => console.error("ERROR:", e.message))
  .finally(() => pool.end());
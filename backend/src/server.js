const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const pool = require("./db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error conectando a la DB:", err);
  } else {
    console.log("DB conectada:", res.rows);
  }
}); 

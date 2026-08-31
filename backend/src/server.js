require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { swaggerUi, specs } = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const recomendationRoutes = require("./routes/recomendation.routes");
const courseRoutes = require("./routes/course.routes");
const achievementRoutes = require("./routes/achievement.routes");
const pool = require("./config/db");

const app = express();

/* ─── Seguridad: Helmet ─── */
app.use(helmet());

/* ─── Middlewares globales ─── */
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

/* ─── Documentación Swagger ─── */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ─── Rutas ─── */
app.use("/api/auth", authRoutes);
app.use("/api", recomendationRoutes); // <--- Corregido y unificado aquí (maneja /generar, /evaluar y /recomendar)
app.use("/api/courses", courseRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/users", require("./routes/user.routes"));

/* ─── Ruta no encontrada ─── */
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/* ─── Manejador de errores global ─── */
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

/* ─── Inicio del servidor ─── */
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación en    http://localhost:${PORT}/api-docs`);

  try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error conectando a la base de datos:", error.message);
  }
});
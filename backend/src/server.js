require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { swaggerUi, specs } = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const recomendationRoutes = require("./routes/recomendation.routes");
const courseRoutes = require("./routes/course.routes");
const paymentRoutes = require("./routes/payment.routes");
const paymentController = require("./controllers/payment.controller");
const pool = require("./config/db");

const app = express();

/* ─── Seguridad: Helmet ─── */
app.use(helmet());

/* ─── Middlewares globales ─── */
app.use(cors());
app.use(express.json({ limit: "10kb" }));

/* ─── Documentación Swagger ─── */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ─── Rutas ─── */
app.use("/api/auth", authRoutes);
app.use("/api", recomendationRoutes); // <--- Corregido y unificado aquí (maneja /generar, /evaluar y /recomendar)
app.use("/api/courses", courseRoutes);
app.use("/api/pagos", paymentRoutes);

/* ─── Eventos (webhook) de Wompi ───
   A diferencia de Stripe, Wompi valida su firma con los
   VALORES del JSON, no con el body "crudo". Por eso esta
   ruta puede ir después de express.json() sin problema. */
app.post("/api/wompi/eventos", paymentController.evento);

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
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
const achievementRoutes = require("./routes/achievement.routes");
const csrfOrigin = require("./middlewares/csrfOrigin");
const pool = require("./config/db");

const app = express();

/* ─── Seguridad: Helmet ─── */
app.use(helmet());

/* ─── Trust proxy: imprescindible tras un proxy/load balancer para que
   express-rate-limit y req.ip calculen la IP real del cliente.
   Configurar TRUST_PROXY (true|1|2|false) en backend/.env según el despliegue. ─── */
const trustProxyEnv = String(process.env.TRUST_PROXY || "").toLowerCase();
app.set(
  "trust proxy",
  trustProxyEnv === "false" || trustProxyEnv === ""
    ? false
    : trustProxyEnv === "true"
      ? 1
      : Number.isInteger(Number(trustProxyEnv)) && Number(trustProxyEnv) > 0
        ? Number(trustProxyEnv)
        : false
);

/* ─── Middlewares globales ─── */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

/* Defensa CSRF: rechaza peticiones de cambio de estado cuyo Origin no esté
   en la lista blanca (las cookies SameSite=None viajan cross-site). Exime
   endpoints firmados como el webhook de Wompi, que no usan cookies. */
app.use(csrfOrigin(allowedOrigins, { bypassPaths: ["/api/wompi/eventos"] }));

app.use(express.json({ limit: "1mb" }));

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
app.use("/api/achievements", achievementRoutes);
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

/* ─── Ruta no encontrada ─── */
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/* ─── Manejador de errores global ─── */
app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.status === 413)) {
    return res.status(413).json({ error: "El cuerpo de la petición es demasiado grande." });
  }
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido en el cuerpo de la petición." });
  }
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

  /* ─── Keep-alive de la base de datos ───
     Neon (Postgres serverless) suspende el cómputo tras unos minutos
     de inactividad. La primera consulta después de eso tarda varios
     segundos en "despertarlo". Mientras el backend esté corriendo,
     este ping evita que la base llegue a dormirse. */
  const INTERVALO_KEEP_ALIVE_MS = 4 * 60 * 1000; // 4 minutos
  setInterval(async () => {
    try {
      await pool.query("SELECT 1");
    } catch (error) {
      console.error("⚠️  Falló el ping de keep-alive a la base de datos:", error.message);
    }
  }, INTERVALO_KEEP_ALIVE_MS);
});
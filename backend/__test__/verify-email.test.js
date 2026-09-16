const request = require("supertest");
const express = require("express");
const authRouter = require("../src/routes/auth.routes");
const authController = require("../src/controllers/auth.controller");

jest.mock("../src/controllers/auth.controller");

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

const TOKEN_VALIDO = "a".repeat(64); // formato hex de 64 caracteres

describe("GET /api/auth/verify-email", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Debería verificar el correo exitosamente (200)", async () => {
    authController.verifyEmail.mockImplementation((req, res) => {
      return res.status(200).json({ message: "Correo verificado exitosamente. Ya puedes iniciar sesión." });
    });

    const response = await request(app).get(`/api/auth/verify-email?token=${TOKEN_VALIDO}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/verificado/i);
  });

  test("Debería fallar con un token mal formado (400)", async () => {
    const response = await request(app).get("/api/auth/verify-email?token=no-es-hex");

    expect(response.statusCode).toBe(400);
  });

  test("Debería fallar si el token expiró o ya fue usado (400)", async () => {
    authController.verifyEmail.mockImplementation((req, res) => {
      return res.status(400).json({ error: "El enlace ha expirado. Solicita uno nuevo para verificar tu correo." });
    });

    const response = await request(app).get(`/api/auth/verify-email?token=${TOKEN_VALIDO}`);

    expect(response.statusCode).toBe(400);
  });
});

describe("POST /api/auth/resend-verification", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Debería reenviar el correo de verificación (200)", async () => {
    authController.resendVerification.mockImplementation((req, res) => {
      return res.status(200).json({ message: "Correo de verificación reenviado" });
    });

    const response = await request(app)
      .post("/api/auth/resend-verification")
      .send({ email: "juan@email.com" });

    expect(response.statusCode).toBe(200);
  });

  test("Debería fallar si el correo no está registrado (404)", async () => {
    authController.resendVerification.mockImplementation((req, res) => {
      return res.status(404).json({ error: "El correo no está registrado" });
    });

    const response = await request(app)
      .post("/api/auth/resend-verification")
      .send({ email: "noexiste@email.com" });

    expect(response.statusCode).toBe(404);
  });
});

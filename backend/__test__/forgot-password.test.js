const request = require("supertest");
const express = require("express");
const authRouter = require("../src/routes/auth.routes");
const authController = require("../src/controllers/auth.controller");

jest.mock("../src/controllers/auth.controller");

const app = Webpack = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Debería enviar el correo de recuperación (200)", async () => {
    authController.forgotPassword.mockImplementation((req, res) => {
      return res.status(200).json({ message: "Correo de recuperación enviado" });
    });

    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "juan@email.com" });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Correo de recuperación enviado");
  });

  test("Debería fallar si el correo no existe (404)", async () => {
    authController.forgotPassword.mockImplementation((req, res) => {
      return res.status(404).json({ error: "El correo no está registrado" });
    });

    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "noexiste@email.com" });

    expect(response.statusCode).toBe(404);
  });
});
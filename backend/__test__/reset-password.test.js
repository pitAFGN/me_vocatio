const request = require("supertest");
const express = require("express");
const authRouter = require("../src/routes/auth.routes");
const authController = require("../src/controllers/auth.controller");

jest.mock("../src/controllers/auth.controller");

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Debería actualizar la contraseña con un token válido (200)", async () => {
    authController.resetPassword.mockImplementation((req, res) => {
      return res.status(200).json({ message: "Contraseña actualizada" });
    });

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "token-valido",
        newPassword: "NuevaPasswordSegura123!"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Contraseña actualizada");
  });

  test("Debería fallar si el token es inválido o expiró (400)", async () => {
    authController.resetPassword.mockImplementation((req, res) => {
      return res.status(400).json({ error: "Token inválido o expirado" });
    });

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "token-invalido",
        newPassword: "NuevaPasswordSegura123!"
      });

    expect(response.statusCode).toBe(400);
  });
});
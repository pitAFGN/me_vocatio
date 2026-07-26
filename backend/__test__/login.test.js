const request = require("supertest");
const express = require("express");
const authRouter = require("../src/routes/auth.routes");
const authController = require("../src/controllers/auth.controller");

jest.mock("../src/controllers/auth.controller");

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("POST /api/auth/login", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Debería iniciar sesión y retornar un JWT (200)", async () => {
    // Simulamos que el controlador valida las credenciales y genera un token ficticio
    authController.login.mockImplementation((req, res) => {
      return res.status(200).json({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." });
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "juan@email.com",
        password: "segura12"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("Debería rechazar credenciales inválidas (401)", async () => {
    // Simulamos que el controlador no encuentra coincidencia de usuario/password
    authController.login.mockImplementation((req, res) => {
      return res.status(401).json({ error: "Credenciales inválidas" });
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "juan@email.com",
        password: "clave_incorrecta"
      });

    expect(response.statusCode).toBe(401);
  });
});
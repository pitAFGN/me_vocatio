const request = require("supertest");
const express = require("express");
const authRouter = require("../src/routes/auth.routes"); 
const authController = require("../src/controllers/auth.controller");

// Interceptamos el controlador para controlar sus respuestas
jest.mock("../src/controllers/auth.controller");

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("POST /api/auth/register", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Debería registrar un usuario exitosamente (201)", async () => {
    // Forzamos al controlador a simular un registro exitoso
    authController.register.mockImplementation((req, res) => {
      return res.status(201).json({ message: "Usuario creado exitosamente" });
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Juan Pérez",
        email: "juan@email.com",
        password: "PasswordSegura123!"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Usuario creado exitosamente");
  });

  test("Debería fallar si el correo ya está registrado (409)", async () => {
    // Forzamos al controlador a simular un conflicto de duplicidad
    authController.register.mockImplementation((req, res) => {
      return res.status(409).json({ error: "El correo ya está registrado" });
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Juan Pérez",
        email: "juan@email.com",
        password: "PasswordSegura123!"
      });

    expect(response.statusCode).toBe(409);
  });
});
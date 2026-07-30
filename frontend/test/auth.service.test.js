import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/services/auth.service";
import { API_URL } from "@/lib/constants";

function mockFetchOnce(ok, data) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: vi.fn().mockResolvedValue(data),
  });
}

describe("authService", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe("login", () => {
    it("llama al endpoint correcto con el body correcto", async () => {
      mockFetchOnce(true, { token: "abc123" });

      await authService.login("test@test.com", "pass1234");

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@test.com", password: "pass1234" }),
        })
      );
    });

    it("retorna los datos cuando la respuesta es exitosa", async () => {
      mockFetchOnce(true, { token: "abc123" });

      const result = await authService.login("test@test.com", "pass1234");

      expect(result).toEqual({ token: "abc123" });
    });

    it("lanza un error con el mensaje del backend si la respuesta falla", async () => {
      mockFetchOnce(false, { error: "Credenciales inválidas" });

      await expect(authService.login("a@a.com", "x")).rejects.toThrow(
        "Credenciales inválidas"
      );
    });

    it("lanza un error genérico si el backend no envía mensaje", async () => {
      mockFetchOnce(false, {});

      await expect(authService.login("a@a.com", "x")).rejects.toThrow(
        "Credenciales inválidas"
      );
    });
  });

  describe("register", () => {
    it("llama al endpoint correcto con nombre, email y password", async () => {
      mockFetchOnce(true, { id: 1, name: "Juan", email: "juan@test.com" });

      await authService.register("Juan", "juan@test.com", "pass1234");

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/register`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            name: "Juan",
            email: "juan@test.com",
            password: "pass1234",
          }),
        })
      );
    });

    it("lanza error con mensaje del backend si falla el registro", async () => {
      mockFetchOnce(false, { error: "Este email ya está registrado" });

      await expect(
        authService.register("Juan", "juan@test.com", "pass1234")
      ).rejects.toThrow("Este email ya está registrado");
    });
  });

  describe("forgotPassword", () => {
    it("llama al endpoint correcto con el email", async () => {
      mockFetchOnce(true, { ok: true });

      await authService.forgotPassword("juan@test.com");

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/forgot-password`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "juan@test.com" }),
        })
      );
    });

    it("lanza error si el backend responde con error", async () => {
      mockFetchOnce(false, { error: "No se pudo enviar el correo" });

      await expect(authService.forgotPassword("x@x.com")).rejects.toThrow(
        "No se pudo enviar el correo"
      );
    });
  });

  describe("resetPassword", () => {
    it("llama al endpoint correcto con token y newPassword", async () => {
      mockFetchOnce(true, { ok: true });

      await authService.resetPassword("token123", "newpass12");

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/reset-password`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ token: "token123", newPassword: "newpass12" }),
        })
      );
    });

    it("lanza error 'Token inválido o expirado' si el backend no da mensaje", async () => {
      mockFetchOnce(false, {});

      await expect(
        authService.resetPassword("badtoken", "newpass12")
      ).rejects.toThrow("Token inválido o expirado");
    });
  });
});

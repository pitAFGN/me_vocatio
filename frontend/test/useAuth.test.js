import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

describe("useAuth", () => {
  let push, replace;

  beforeEach(() => {
    push = vi.fn();
    replace = vi.fn();
    useRouter.mockReturnValue({ push, replace });
  });

  it("login: guarda el token en localStorage y redirige a /dashboard", async () => {
    authService.login.mockResolvedValue({ token: "jwt-token-123" });
    const { result } = renderHook(() => useAuth());

    await result.current.login("user@test.com", "pass1234");

    expect(authService.login).toHaveBeenCalledWith("user@test.com", "pass1234");
    expect(localStorage.getItem("token")).toBe("jwt-token-123");
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("login: no guarda token ni redirige si el servicio falla", async () => {
    authService.login.mockRejectedValue(new Error("Credenciales inválidas"));
    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.login("user@test.com", "wrong")
    ).rejects.toThrow("Credenciales inválidas");

    expect(localStorage.getItem("token")).toBeNull();
    expect(push).not.toHaveBeenCalled();
  });

  it("register: delega en authService.register con los parámetros correctos", async () => {
    authService.register.mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAuth());

    await result.current.register("Juan", "juan@test.com", "pass1234");

    expect(authService.register).toHaveBeenCalledWith(
      "Juan",
      "juan@test.com",
      "pass1234"
    );
  });

  it("logout: elimina el token de localStorage y redirige a /login", () => {
    localStorage.setItem("token", "jwt-token-123");
    const { result } = renderHook(() => useAuth());

    result.current.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("forgotPassword: delega en authService.forgotPassword", async () => {
    authService.forgotPassword.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useAuth());

    await result.current.forgotPassword("juan@test.com");

    expect(authService.forgotPassword).toHaveBeenCalledWith("juan@test.com");
  });

  it("resetPassword: delega en authService.resetPassword y redirige a /login", async () => {
    authService.resetPassword.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useAuth());

    await result.current.resetPassword("token123", "newpass12");

    expect(authService.resetPassword).toHaveBeenCalledWith(
      "token123",
      "newpass12"
    );
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("getToken: retorna null si no hay token en localStorage", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.getToken()).toBeNull();
  });

  it("getToken: retorna el token almacenado en localStorage", () => {
    localStorage.setItem("token", "abc-123");
    const { result } = renderHook(() => useAuth());
    expect(result.current.getToken()).toBe("abc-123");
  });
});

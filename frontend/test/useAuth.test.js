import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    googleSync: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
    me: vi.fn(),
  },
}));

describe("useAuth", () => {
  let push, replace;

  beforeEach(() => {
    push = vi.fn();
    replace = vi.fn();
    useRouter.mockReturnValue({ push, replace });
  });

  it("login: delega en authService.login y redirige a /dashboard", async () => {
    authService.login.mockResolvedValue({ id: 1, name: "Juan", email: "user@test.com" });
    const { result } = renderHook(() => useAuth());

    await result.current.login("user@test.com", "pass1234");

    expect(authService.login).toHaveBeenCalledWith("user@test.com", "pass1234");
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("login: no redirige si el servicio falla", async () => {
    authService.login.mockRejectedValue(new Error("Credenciales inválidas"));
    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.login("user@test.com", "wrong")
    ).rejects.toThrow("Credenciales inválidas");

    expect(push).not.toHaveBeenCalled();
  });

  it("register: delega en authService.register con los parámetros correctos", async () => {
    authService.register.mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAuth());

    await result.current.register("Juan", "juan@test.com", "pass1234", "captcha-token");

    expect(authService.register).toHaveBeenCalledWith(
      "Juan",
      "juan@test.com",
      "pass1234",
      "captcha-token"
    );
  });

  it("logout: cierra la sesión y redirige a /login", async () => {
    authService.logout.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useAuth());

    await result.current.logout();

    expect(authService.logout).toHaveBeenCalled();
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

  it("googleLogin: delega en authService.googleSync y redirige a /dashboard", async () => {
    authService.googleSync.mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAuth());

    await result.current.googleLogin("juan@test.com", "Juan", "google-token");

    expect(authService.googleSync).toHaveBeenCalledWith("juan@test.com", "Juan", "google-token");
    expect(replace).toHaveBeenCalledWith("/dashboard");
  });
});
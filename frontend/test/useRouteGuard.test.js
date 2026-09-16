import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useProtectedRoute, usePublicRoute } from "@/hooks/useRouteGuard";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  authService: {
    me: vi.fn(),
    refresh: vi.fn(),
  },
}));

describe("useProtectedRoute", () => {
  let replace;

  beforeEach(() => {
    replace = vi.fn();
    useRouter.mockReturnValue({ replace, push: vi.fn() });
    authService.me.mockReset();
    authService.refresh.mockReset();
  });

  it("redirige a /login y mantiene loading=true si el backend no valida la sesión", async () => {
    authService.me.mockRejectedValue(new Error("No autorizado"));
    authService.refresh.mockRejectedValue(new Error("Sesión expirada"));

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(result.current.loading).toBe(true);
  });

  it("no redirige y pone loading=false si la sesión es válida", async () => {
    authService.me.mockResolvedValue({ user: { id: 1, name: "Samuel" } });

    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(replace).not.toHaveBeenCalled();
  });
});

describe("usePublicRoute", () => {
  let replace;

  beforeEach(() => {
    replace = vi.fn();
    useRouter.mockReturnValue({ replace, push: vi.fn() });
    authService.me.mockReset();
    authService.refresh.mockReset();
  });

  it("redirige a /dashboard sin bloquear el render (loading=false) si hay sesión", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });

    const { result } = renderHook(() => usePublicRoute());

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    // Las rutas públicas nunca bloquean el render para acelerar el primer pintado.
    expect(result.current.loading).toBe(false);
  });

  it("no redirige y pone loading=false si no hay sesión", async () => {
    authService.me.mockRejectedValue(new Error("No autorizado"));
    authService.refresh.mockRejectedValue(new Error("Sesión expirada"));

    const { result } = renderHook(() => usePublicRoute());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(replace).not.toHaveBeenCalled();
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useProtectedRoute, usePublicRoute } from "@/hooks/useRouteGuard";

describe("useProtectedRoute", () => {
  let replace;

  beforeEach(() => {
    replace = vi.fn();
    useRouter.mockReturnValue({ replace, push: vi.fn() });
  });

  it("redirige a /login y mantiene loading=true si no hay token", async () => {
    const { result } = renderHook(() => useProtectedRoute());

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(result.current.loading).toBe(true);
  });

  it("no redirige y pone loading=false si hay token", async () => {
    localStorage.setItem("token", "abc123");
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
  });

  it("redirige a /dashboard y mantiene loading=true si hay token", async () => {
    localStorage.setItem("token", "abc123");
    const { result } = renderHook(() => usePublicRoute());

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(result.current.loading).toBe(true);
  });

  it("no redirige y pone loading=false si no hay token", async () => {
    const { result } = renderHook(() => usePublicRoute());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(replace).not.toHaveBeenCalled();
  });
});

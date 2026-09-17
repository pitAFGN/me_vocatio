import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import NavbarProfile from "@/components/NavbarProfile";
import { authService } from "@/services/auth.service";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

vi.mock("@/services/auth.service", () => ({
  authService: { me: vi.fn(), refresh: vi.fn() },
}));

describe("NavbarProfile", () => {
  let replace, push;

  beforeEach(() => {
    replace = vi.fn();
    push = vi.fn();
    useRouter.mockReturnValue({ replace, push });
    authService.me.mockReset();
    authService.refresh.mockReset();
    authService.refresh.mockRejectedValue(new Error("sin refresh"));
  });

  it("muestra el botón ACCESO si no hay sesión", async () => {
    authService.me.mockRejectedValue(new Error("No autorizado"));
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    await waitFor(() => expect(authService.me).toHaveBeenCalled());
    expect(screen.getByRole("link", { name: "ACCESO" })).toBeInTheDocument();
  });

  it("muestra el menú de perfil si hay sesión en una ruta pública", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });
    usePathname.mockReturnValue("/nosotros");
    render(<NavbarProfile />);

    await waitFor(() => expect(authService.me).toHaveBeenCalled());
    expect(
      screen.getByRole("button", { name: "Menú de perfil" })
    ).toBeInTheDocument();
  });

  it("muestra el botón de crear recurso si hay sesión y la ruta es /dashboard", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    expect(
      await screen.findByRole("button", { name: "Crear recurso" })
    ).toBeInTheDocument();
  });

  it("no muestra el botón de crear recurso en /vocacion (solo /dashboard)", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });
    usePathname.mockReturnValue("/vocacion/123");
    render(<NavbarProfile />);

    await waitFor(() => expect(authService.me).toHaveBeenCalled());
    expect(
      screen.queryByRole("button", { name: "Crear recurso" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Menú de perfil" })
    ).toBeInTheDocument();
  });

  it("navega a /creacion_recursos al hacer click en 'Crear recurso'", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(await screen.findByRole("button", { name: "Crear recurso" }));

    expect(push).toHaveBeenCalledWith("/creacion_recursos");
  });
});
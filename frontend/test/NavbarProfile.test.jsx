import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import NavbarProfile from "@/components/NavbarProfile";
import { authService } from "@/services/auth.service";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

vi.mock("@/services/auth.service", () => ({
  authService: { me: vi.fn() },
}));

describe("NavbarProfile", () => {
  let replace, push;

  beforeEach(() => {
    replace = vi.fn();
    push = vi.fn();
    useRouter.mockReturnValue({ replace, push });
    authService.me.mockReset();
  });

  it("no renderiza nada si no hay sesión aunque esté en zona privada", async () => {
    authService.me.mockRejectedValue(new Error("No autorizado"));
    usePathname.mockReturnValue("/dashboard");
    const { container } = render(<NavbarProfile />);

    await waitFor(() => expect(authService.me).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada si hay sesión pero la ruta no es privada", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });
    usePathname.mockReturnValue("/nosotros");
    const { container } = render(<NavbarProfile />);

    await waitFor(() => expect(authService.me).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
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
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("navega a /creacion_recursos al hacer click en 'Crear recurso'", async () => {
    authService.me.mockResolvedValue({ user: { id: 1 } });
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(await screen.findByRole("button", { name: "Crear recurso" }));

    expect(push).toHaveBeenCalledWith("/creacion_recursos");
  });
});
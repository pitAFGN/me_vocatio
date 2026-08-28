import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import NavbarProfile from "@/components/NavbarProfile";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

describe("NavbarProfile", () => {
  let replace, push;

  beforeEach(() => {
    replace = vi.fn();
    push = vi.fn();
    useRouter.mockReturnValue({ replace, push });
  });

  it("no renderiza nada si no hay token aunque esté en zona privada", () => {
    usePathname.mockReturnValue("/dashboard");
    const { container } = render(<NavbarProfile />);
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada si hay token pero la ruta no es privada", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/nosotros");
    const { container } = render(<NavbarProfile />);
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el botón de crear recurso si hay token y la ruta es /dashboard", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);
    expect(
      screen.getByRole("button", { name: "Crear recurso" })
    ).toBeInTheDocument();
  });

  it("no muestra el botón de crear recurso en /vocacion (solo /dashboard)", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/vocacion/123");
    render(<NavbarProfile />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("navega a /creacion_recursos al hacer click en 'Crear recurso'", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Crear recurso" }));

    expect(push).toHaveBeenCalledWith("/creacion_recursos");
  });
});

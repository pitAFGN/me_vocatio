import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePublicRoute } from "@/hooks/useRouteGuard";
import LandingPage from "@/pages/Home";

vi.mock("@/hooks/useRouteGuard", () => ({
  usePublicRoute: vi.fn(),
}));

describe("LandingPage (Home)", () => {
  beforeEach(() => {
    usePublicRoute.mockReturnValue({ loading: false });
  });

  it("muestra el estado de carga mientras se verifica la sesión", () => {
    usePublicRoute.mockReturnValue({ loading: true });
    render(<LandingPage />);
    expect(screen.getByText(/Cargando MeVocatio/i)).toBeInTheDocument();
  });

  it("muestra el contenido principal cuando ya verificó la sesión", () => {
    render(<LandingPage />);
    expect(
      screen.getByText(/Pulimos tu potencial profesional/i)
    ).toBeInTheDocument();
  });

  it("muestra un enlace a /login para empezar", () => {
    render(<LandingPage />);
    const enlace = screen.getByRole("link", {
      name: /Empieza a pulir tu futuro/i,
    });
    expect(enlace).toHaveAttribute("href", "/login");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NosotrosPage from "@/pages/Nosotros";

// OpinionesCarrusel usa framer-motion e intervals; lo aislamos aquí también
vi.mock("@/components/OpinionesCarrusel", () => ({
  default: () => <div data-testid="carrusel-mock">Carrusel</div>,
}));

describe("NosotrosPage", () => {
  it("renderiza el título principal", () => {
    render(<NosotrosPage />);
    expect(screen.getByText("Nuestra Esencia")).toBeInTheDocument();
  });

  it("muestra la sección de Beneficios con sus 4 ítems", () => {
    render(<NosotrosPage />);
    expect(screen.getByText("Beneficios")).toBeInTheDocument();
    expect(screen.getByText("01.")).toBeInTheDocument();
    expect(screen.getByText("02.")).toBeInTheDocument();
    expect(screen.getByText("03.")).toBeInTheDocument();
    expect(screen.getByText("04.")).toBeInTheDocument();
  });

  it("muestra la sección de Funcionamiento con sus 3 pasos", () => {
    render(<NosotrosPage />);
    expect(screen.getByText("Funcionamiento")).toBeInTheDocument();
    expect(screen.getByText("Regístrate:")).toBeInTheDocument();
    expect(screen.getByText("Diagnóstico:")).toBeInTheDocument();
    expect(screen.getByText("Mejora:")).toBeInTheDocument();
  });

  it("muestra la sección de Casos de Éxito con el carrusel", () => {
    render(<NosotrosPage />);
    expect(screen.getByText("Casos de Éxito")).toBeInTheDocument();
    expect(screen.getByTestId("carrusel-mock")).toBeInTheDocument();
  });

  it("tiene un enlace de cierre que apunta a '/'", () => {
    render(<NosotrosPage />);
    const enlace = screen.getByRole("link", { name: /Cerrar/i });
    expect(enlace).toHaveAttribute("href", "/");
  });
});

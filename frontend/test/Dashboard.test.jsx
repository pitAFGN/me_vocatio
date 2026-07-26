import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useRouteGuard";
import Dashboard from "@/pages/Dashboard";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useRouteGuard", () => ({
  useProtectedRoute: vi.fn(),
}));

describe("Dashboard", () => {
  let push, logout;

  beforeEach(() => {
    push = vi.fn();
    logout = vi.fn();
    useRouter.mockReturnValue({ push, replace: vi.fn() });
    useAuth.mockReturnValue({ logout });
    useProtectedRoute.mockReturnValue({ loading: false });
  });

  it("muestra pantalla de carga mientras useProtectedRoute está verificando", () => {
    useProtectedRoute.mockReturnValue({ loading: true });
    render(<Dashboard />);
    expect(screen.getByText(/Verificando acceso/i)).toBeInTheDocument();
  });

  it("muestra el título principal una vez autenticado", () => {
    render(<Dashboard />);
    expect(screen.getByText("Elige tu camino profesional")).toBeInTheDocument();
  });

  it("muestra las primeras 6 profesiones (primera página)", () => {
    render(<Dashboard />);
    expect(screen.getByText("Ingeniería de Software")).toBeInTheDocument();
    expect(screen.getByText("Diseño de Producto")).toBeInTheDocument();
    expect(screen.getByText("Ciencia de Datos")).toBeInTheDocument();
    expect(screen.getByText("Arquitectura Cloud")).toBeInTheDocument();
    expect(screen.getByText("Ciberseguridad")).toBeInTheDocument();
    expect(screen.getByText("Desarrollo de IA")).toBeInTheDocument();
    // La 7ª profesión no debe estar en la primera página
    expect(screen.queryByText("Desarrollo Backend")).not.toBeInTheDocument();
  });

  it("el botón 'Confirmar Selección' está deshabilitado si no hay selección", () => {
    render(<Dashboard />);
    const btn = screen.getByText(/Confirmar Selección/i).closest("button");
    expect(btn).toBeDisabled();
  });

  it("selecciona una profesión al hacer click y habilita el botón de confirmar", () => {
    render(<Dashboard />);
    // Cada tarjeta tiene onClick en el div padre con cursor-pointer
    const tarjeta = screen.getByText("Ingeniería de Software").closest("[class*='cursor-pointer']");
    fireEvent.click(tarjeta);
    const btn = screen.getByText(/Confirmar Selección/i).closest("button");
    expect(btn).not.toBeDisabled();
  });

  it("deselecciona al hacer click dos veces en la misma tarjeta", () => {
    render(<Dashboard />);
    const tarjeta = screen.getByText("Ciencia de Datos").closest("[class*='cursor-pointer']");
    fireEvent.click(tarjeta);
    fireEvent.click(tarjeta);
    const btn = screen.getByText(/Confirmar Selección/i).closest("button");
    expect(btn).toBeDisabled();
  });

  it("confirmar selección guarda en localStorage y navega a /vocacion/:id", () => {
    render(<Dashboard />);
    const tarjeta = screen.getByText("Ingeniería de Software").closest("[class*='cursor-pointer']");
    fireEvent.click(tarjeta);
    fireEvent.click(screen.getByText(/Confirmar Selección/i));

    expect(localStorage.getItem("mevocatio_active_vocation")).toBe("1");
    expect(push).toHaveBeenCalledWith("/vocacion/1");
  });

  it("buscar filtra las profesiones en tiempo real", () => {
    render(<Dashboard />);
    fireEvent.change(
      screen.getByPlaceholderText("Buscar profesiones o áreas de interés..."),
      { target: { value: "datos" } }
    );
    expect(screen.getByText("Ciencia de Datos")).toBeInTheDocument();
    expect(screen.queryByText("Ingeniería de Software")).not.toBeInTheDocument();
  });

  it("muestra mensaje cuando la búsqueda no tiene resultados", () => {
    render(<Dashboard />);
    fireEvent.change(
      screen.getByPlaceholderText("Buscar profesiones o áreas de interés..."),
      { target: { value: "zzzznoexiste" } }
    );
    expect(
      screen.getByText("No encontramos profesiones que coincidan con tu búsqueda.")
    ).toBeInTheDocument();
  });

  it("la búsqueda también filtra por área", () => {
    render(<Dashboard />);
    fireEvent.change(
      screen.getByPlaceholderText("Buscar profesiones o áreas de interés..."),
      { target: { value: "Seguridad Digital" } }
    );
    expect(screen.getByText("Ciberseguridad")).toBeInTheDocument();
    expect(screen.queryByText("Ingeniería de Software")).not.toBeInTheDocument();
  });

  it("la búsqueda es case-insensitive", () => {
    render(<Dashboard />);
    fireEvent.change(
      screen.getByPlaceholderText("Buscar profesiones o áreas de interés..."),
      { target: { value: "DATOS" } }
    );
    expect(screen.getByText("Ciencia de Datos")).toBeInTheDocument();
  });

  it("navega a la segunda página con el botón siguiente (ArrowRight)", () => {
    render(<Dashboard />);
    // Los dos botones de paginación son los únicos con SVG en el header
    // El segundo es ArrowRight (siguiente)
    const allButtons = screen.getAllByRole("button");
    // Filtramos los botones que contienen SVG (paginación)
    const paginacion = allButtons.filter((b) => b.querySelector("svg"));
    const btnSiguiente = paginacion[1]; // ArrowRight es el segundo
    fireEvent.click(btnSiguiente);
    expect(screen.getByText("Desarrollo Backend")).toBeInTheDocument();
  });

  it("el botón Salir llama a logout", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByText(/Salir/i));
    expect(logout).toHaveBeenCalled();
  });
});

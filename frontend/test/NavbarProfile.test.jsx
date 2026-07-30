import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import NavbarProfile from "@/components/NavbarProfile";

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

  it("renderiza la burbuja de perfil si hay token y la ruta es /dashboard", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renderiza la burbuja de perfil si la ruta empieza con /vocacion", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/vocacion/123");
    render(<NavbarProfile />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("abre el menú con el nombre y rol del usuario al hacer click en la burbuja", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Samuel Moreno")).toBeInTheDocument();
    expect(screen.getByText("Estudiante ADSO")).toBeInTheDocument();
  });

  it("'Mis Recursos' navega a /dashboard y cierra el menú", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText(/Mis Recursos/i));

    expect(push).toHaveBeenCalledWith("/dashboard");
    expect(screen.queryByText("Samuel Moreno")).not.toBeInTheDocument();
  });

  it("'Salir' elimina el token, cierra el menú y redirige a /login", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText(/Salir/i));

    expect(localStorage.getItem("token")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Samuel Moreno")).not.toBeInTheDocument();
  });

  it("cierra el menú al hacer click fuera de él", () => {
    localStorage.setItem("token", "abc123");
    usePathname.mockReturnValue("/dashboard");
    render(<NavbarProfile />);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Samuel Moreno")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Samuel Moreno")).not.toBeInTheDocument();
  });
});

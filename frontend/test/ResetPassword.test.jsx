import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ResetPasswordPage from "@/pages/ResetPassword";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("ResetPasswordPage", () => {
  let push, replace, resetPassword;

  beforeEach(() => {
    push = vi.fn();
    replace = vi.fn();
    resetPassword = vi.fn();
    useRouter.mockReturnValue({ push, replace });
    useAuth.mockReturnValue({ resetPassword });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("redirige a /login si no hay token en la URL", async () => {
    useSearchParams.mockReturnValue(new URLSearchParams(""));
    render(<ResetPasswordPage />);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/login"));
  });

  it("muestra el formulario si hay token en la URL", () => {
    useSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
    render(<ResetPasswordPage />);
    expect(screen.getByText(/Nueva Contraseña/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("muestra error si las contraseñas no coinciden", async () => {
    useSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
    render(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "abcde12" } });
    fireEvent.change(inputs[1], { target: { value: "distinta12" } });
    fireEvent.click(screen.getByText("Guardar Cambios"));

    expect(
      await screen.findByText("Las contraseñas no coinciden.")
    ).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("muestra error si la contraseña no cumple el formato requerido", async () => {
    useSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
    render(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "corta1" } });
    fireEvent.change(inputs[1], { target: { value: "corta1" } });
    fireEvent.click(screen.getByText("Guardar Cambios"));

    expect(
      await screen.findByText(
        "La contraseña debe tener mínimo 7 caracteres y al menos 2 números."
      )
    ).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("llama a resetPassword con el token y la nueva contraseña cuando todo es válido", async () => {
    useSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
    resetPassword.mockResolvedValue({ ok: true });
    render(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "abcde12" } });
    fireEvent.change(inputs[1], { target: { value: "abcde12" } });
    fireEvent.click(screen.getByText("Guardar Cambios"));

    await waitFor(() =>
      expect(resetPassword).toHaveBeenCalledWith("abc123", "abcde12")
    );
  });

  it("muestra el error del backend si resetPassword falla", async () => {
    useSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
    resetPassword.mockRejectedValue(new Error("El enlace expiró o es inválido."));
    render(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(inputs[0], { target: { value: "abcde12" } });
    fireEvent.change(inputs[1], { target: { value: "abcde12" } });
    fireEvent.click(screen.getByText("Guardar Cambios"));

    expect(
      await screen.findByText("El enlace expiró o es inválido.")
    ).toBeInTheDocument();
  });

  it("el botón 'Cancelar y Volver al Inicio de Sesión' redirige a /login", () => {
    useSearchParams.mockReturnValue(new URLSearchParams("token=abc123"));
    render(<ResetPasswordPage />);

    fireEvent.click(
      screen.getByText("Cancelar y Volver al Inicio de Sesión")
    );

    expect(replace).toHaveBeenCalledWith("/login");
  });
});

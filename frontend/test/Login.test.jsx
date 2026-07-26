import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePublicRoute } from "@/hooks/useRouteGuard";
import AuthPage from "@/pages/Login";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useRouteGuard", () => ({
  usePublicRoute: vi.fn(),
}));

// Evitamos renderizar el modal real (con sweetalert2 incluido)
vi.mock("@/components/ModalOlvidePassword", () => ({
  default: ({ onClose }) => (
    <div data-testid="modal-olvide">
      <button onClick={onClose}>cerrar-modal</button>
    </div>
  ),
}));

describe("AuthPage (Login)", () => {
  let login, register;

  beforeEach(() => {
    login = vi.fn();
    register = vi.fn();
    useAuth.mockReturnValue({ login, register });
    usePublicRoute.mockReturnValue({ loading: false });
    useSearchParams.mockReturnValue(new URLSearchParams(""));
    useRouter.mockReturnValue({ push: vi.fn(), replace: vi.fn() });
  });

  it("muestra el estado de verificación mientras usePublicRoute está cargando", () => {
    usePublicRoute.mockReturnValue({ loading: true });
    render(<AuthPage />);
    expect(screen.getByText(/Verificando/i)).toBeInTheDocument();
  });

  it("muestra el formulario de login por defecto", () => {
    render(<AuthPage />);
    expect(
      screen.getByRole("heading", { name: "Inicia Sesión" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Nombre Completo")).not.toBeInTheDocument();
  });

  it("muestra el formulario de registro si el query param mode=signup", () => {
    useSearchParams.mockReturnValue(new URLSearchParams("mode=signup"));
    render(<AuthPage />);
    expect(
      screen.getByRole("heading", { name: "Regístrate" })
    ).toBeInTheDocument();
  });

  it("cambia a modo registro al hacer click en la pestaña REGISTRATE", () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByText("REGISTRATE"));
    expect(
      screen.getByRole("heading", { name: "Regístrate" })
    ).toBeInTheDocument();
    expect(screen.getByText("Nombre Completo")).toBeInTheDocument();
  });

  describe("validación de login", () => {
    it("muestra errores si se envía el formulario vacío", async () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText("Entrar al Portal"));

      expect(
        await screen.findByText("El email es obligatorio.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña es obligatoria.")
      ).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });

    it("muestra error de email inválido", async () => {
      render(<AuthPage />);
      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "no-es-un-email" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "algo" },
      });
      fireEvent.click(screen.getByText("Entrar al Portal"));

      expect(
        await screen.findByText("Ingresa un email válido.")
      ).toBeInTheDocument();
    });

    it("llama a login con email y password cuando los datos son válidos", async () => {
      login.mockResolvedValue(undefined);
      render(<AuthPage />);

      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "juan@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "cualquiera" },
      });
      fireEvent.click(screen.getByText("Entrar al Portal"));

      await waitFor(() =>
        expect(login).toHaveBeenCalledWith("juan@test.com", "cualquiera")
      );
    });

    it("muestra error humanizado cuando login falla por credenciales", async () => {
      login.mockRejectedValue(new Error("Credenciales inválidas"));
      render(<AuthPage />);

      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "juan@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "malapass" },
      });
      fireEvent.click(screen.getByText("Entrar al Portal"));

      expect(
        await screen.findByText("Email o contraseña incorrectos.")
      ).toBeInTheDocument();
    });
  });

  describe("validación de registro", () => {
    beforeEach(() => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText("REGISTRATE"));
    });

    it("muestra error si el nombre tiene menos de 3 caracteres", async () => {
      fireEvent.change(screen.getByPlaceholderText("JESUS TORRES"), {
        target: { value: "Jo" },
      });
      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "juan@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "abcde12" },
      });
      fireEvent.click(screen.getByText("Crear Cuenta"));

      expect(
        await screen.findByText("El nombre debe tener al menos 3 caracteres.")
      ).toBeInTheDocument();
      expect(register).not.toHaveBeenCalled();
    });

    it("muestra error si la contraseña no cumple el formato", async () => {
      fireEvent.change(screen.getByPlaceholderText("JESUS TORRES"), {
        target: { value: "Juan Torres" },
      });
      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "juan@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "corta1" },
      });
      fireEvent.click(screen.getByText("Crear Cuenta"));

      expect(
        await screen.findByText("Mínimo 7 caracteres y al menos 2 números.")
      ).toBeInTheDocument();
      expect(register).not.toHaveBeenCalled();
    });

    it("registra correctamente, limpia el formulario y vuelve a modo login", async () => {
      register.mockResolvedValue({ id: 1 });

      fireEvent.change(screen.getByPlaceholderText("JESUS TORRES"), {
        target: { value: "Juan Torres" },
      });
      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "juan@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "abcde12" },
      });
      fireEvent.click(screen.getByText("Crear Cuenta"));

      await waitFor(() =>
        expect(register).toHaveBeenCalledWith(
          "Juan Torres",
          "juan@test.com",
          "abcde12"
        )
      );

      expect(
        await screen.findByText("¡Cuenta creada! Ahora inicia sesión.")
      ).toBeInTheDocument();
      // Vuelve a modo login
      expect(
        screen.getByRole("heading", { name: "Inicia Sesión" })
      ).toBeInTheDocument();
    });

    it("muestra error humanizado si el email ya está registrado", async () => {
      register.mockRejectedValue(new Error("Este email ya está registrado"));

      fireEvent.change(screen.getByPlaceholderText("JESUS TORRES"), {
        target: { value: "Juan Torres" },
      });
      fireEvent.change(screen.getByPlaceholderText("NAME@COMPANY.COM"), {
        target: { value: "juan@test.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "abcde12" },
      });
      fireEvent.click(screen.getByText("Crear Cuenta"));

      expect(
        await screen.findByText(
          "Este email ya tiene una cuenta. Inicia sesión."
        )
      ).toBeInTheDocument();
    });
  });

  describe("modal de olvidé mi contraseña", () => {
    it("abre el modal al hacer click en '¿Olvidaste tu contraseña?'", () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText("¿Olvidaste tu contraseña?"));
      expect(screen.getByTestId("modal-olvide")).toBeInTheDocument();
    });

    it("cierra el modal cuando se invoca onClose", () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText("¿Olvidaste tu contraseña?"));
      fireEvent.click(screen.getByText("cerrar-modal"));
      expect(screen.queryByTestId("modal-olvide")).not.toBeInTheDocument();
    });

    it("no muestra el enlace de '¿Olvidaste tu contraseña?' en modo registro", () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText("REGISTRATE"));
      expect(
        screen.queryByText("¿Olvidaste tu contraseña?")
      ).not.toBeInTheDocument();
    });
  });
});

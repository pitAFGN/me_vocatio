import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import ModalOlvidePassword from "@/components/ModalOlvidePassword";

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("ModalOlvidePassword", () => {
  let forgotPassword, onClose;

  beforeEach(() => {
    forgotPassword = vi.fn();
    onClose = vi.fn();
    useAuth.mockReturnValue({ forgotPassword });
  });

  it("renderiza el formulario con el input de email", () => {
    render(<ModalOlvidePassword onClose={onClose} />);
    expect(
      screen.getByPlaceholderText("TU-EMAIL@EJEMPLO.COM")
    ).toBeInTheDocument();
  });

  it("llama a forgotPassword con el email ingresado al enviar el formulario", async () => {
    forgotPassword.mockResolvedValue({ ok: true });
    render(<ModalOlvidePassword onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("TU-EMAIL@EJEMPLO.COM"), {
      target: { value: "juan@test.com" },
    });
    fireEvent.click(screen.getByText("Enviar Enlace"));

    await waitFor(() =>
      expect(forgotPassword).toHaveBeenCalledWith("juan@test.com")
    );
  });

  it("muestra un Swal de éxito y cierra el modal cuando la petición es exitosa", async () => {
    forgotPassword.mockResolvedValue({ ok: true });
    render(<ModalOlvidePassword onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("TU-EMAIL@EJEMPLO.COM"), {
      target: { value: "juan@test.com" },
    });
    fireEvent.click(screen.getByText("Enviar Enlace"));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: "success" })
      )
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("muestra un Swal de error y NO cierra el modal cuando la petición falla", async () => {
    forgotPassword.mockRejectedValue(new Error("No se pudo enviar el correo"));
    render(<ModalOlvidePassword onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("TU-EMAIL@EJEMPLO.COM"), {
      target: { value: "juan@test.com" },
    });
    fireEvent.click(screen.getByText("Enviar Enlace"));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          text: "No se pudo enviar el correo",
        })
      )
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el botón de cerrar (✕)", () => {
    render(<ModalOlvidePassword onClose={onClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el fondo (overlay)", () => {
    const { container } = render(<ModalOlvidePassword onClose={onClose} />);
    const overlay = container.querySelector(".absolute.inset-0");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });
});

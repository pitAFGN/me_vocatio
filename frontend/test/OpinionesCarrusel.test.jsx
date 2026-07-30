import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OpinionesCarrusel from "@/components/OpinionesCarrusel";

// framer-motion no funciona en jsdom sin config extra; mockeamos motion.div
// como un div normal para poder testear la lógica del carrusel.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, animate, ...rest }) =>
      // Convertimos `animate` a data-attr para inspeccionarlo en tests
      require("react").createElement(
        "div",
        { ...rest, "data-animate": JSON.stringify(animate) },
        children
      ),
  },
}));

describe("OpinionesCarrusel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra todas las opiniones en el DOM", () => {
    render(<OpinionesCarrusel />);
    expect(
      screen.getByText(/"Me encantó, excelente acompañamiento"/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/"Muy intuitiva la plataforma, 10\/10"/i)
    ).toBeInTheDocument();
  });

  it("avanza al siguiente grupo al hacer click en →", () => {
    render(<OpinionesCarrusel />);
    const animContainer = document.querySelector("[data-animate]");
    const xInicial = JSON.parse(animContainer.getAttribute("data-animate")).x;

    fireEvent.click(screen.getByText("→"));

    const xDespues = JSON.parse(animContainer.getAttribute("data-animate")).x;
    expect(xDespues).not.toBe(xInicial);
  });

  it("retrocede al grupo anterior al hacer click en ←", () => {
    render(<OpinionesCarrusel />);
    // Avanzamos primero para poder retroceder
    fireEvent.click(screen.getByText("→"));
    const animContainer = document.querySelector("[data-animate]");
    const xTrasAvanzar = JSON.parse(animContainer.getAttribute("data-animate")).x;

    fireEvent.click(screen.getByText("←"));

    const xTrasRetroceder = JSON.parse(
      animContainer.getAttribute("data-animate")
    ).x;
    expect(xTrasRetroceder).not.toBe(xTrasAvanzar);
  });

  it("al hacer ← desde el inicio, salta al final del carrusel", () => {
    render(<OpinionesCarrusel />);
    const animContainer = document.querySelector("[data-animate]");
    const xInicial = JSON.parse(animContainer.getAttribute("data-animate")).x;

    fireEvent.click(screen.getByText("←"));

    const xDespues = JSON.parse(animContainer.getAttribute("data-animate")).x;
    // Salta al final: x debe ser mayor (más desplazamiento)
    expect(xDespues).not.toBe(xInicial);
  });

  it("avanza automáticamente cada 3 segundos", () => {
    render(<OpinionesCarrusel />);
    const animContainer = document.querySelector("[data-animate]");
    const xAntes = JSON.parse(animContainer.getAttribute("data-animate")).x;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const xDespues = JSON.parse(animContainer.getAttribute("data-animate")).x;
    expect(xDespues).not.toBe(xAntes);
  });

  it("vuelve al índice 0 cuando llega al último grupo en el avance automático", () => {
    render(<OpinionesCarrusel />);
    const animContainer = document.querySelector("[data-animate]");

    // Avanzamos manualmente hasta el final (8 opiniones, 4 visibles → 4 pasos)
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("→"));
    }
    // Ahora estamos al final (index + cardsVisibles >= opiniones.length)
    fireEvent.click(screen.getByText("→"));

    const xAlFinal = JSON.parse(animContainer.getAttribute("data-animate")).x;
    // Debe haber vuelto a x: "-0%" (índice 0)
    expect(xAlFinal).toBe("-0%");
  });
});

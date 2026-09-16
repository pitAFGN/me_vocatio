import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OpinionesCarrusel from "@/components/OpinionesCarrusel";

const getTrack = () =>
  document.querySelector('[data-testid="carrusel-track"]');

describe("OpinionesCarrusel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra las opiniones en el DOM", () => {
    render(<OpinionesCarrusel />);
    expect(
      screen.getByText(/Me encantó, excelente acompañamiento/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Muy intuitiva la plataforma, 10\/10/)
    ).toBeInTheDocument();
  });

  it("avanza al siguiente grupo al hacer click en →", () => {
    render(<OpinionesCarrusel />);
    const xInicial = getTrack().style.transform;

    fireEvent.click(screen.getByText("→"));

    const xDespues = getTrack().style.transform;
    expect(xDespues).not.toBe(xInicial);
  });

  it("retrocede al grupo anterior al hacer click en ←", () => {
    render(<OpinionesCarrusel />);
    fireEvent.click(screen.getByText("→"));
    const xTrasAvanzar = getTrack().style.transform;

    fireEvent.click(screen.getByText("←"));

    const xTrasRetroceder = getTrack().style.transform;
    expect(xTrasRetroceder).not.toBe(xTrasAvanzar);
  });

  it("al hacer ← desde el inicio, salta al final del carrusel", () => {
    render(<OpinionesCarrusel />);
    const xInicial = getTrack().style.transform;

    fireEvent.click(screen.getByText("←"));

    const xDespues = getTrack().style.transform;
    expect(xDespues).not.toBe(xInicial);
  });

  it("avanza automáticamente cada 3.5 segundos", () => {
    render(<OpinionesCarrusel />);
    const xAntes = getTrack().style.transform;

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    const xDespues = getTrack().style.transform;
    expect(xDespues).not.toBe(xAntes);
  });

  it("vuelve al índice 0 cuando llega al último grupo en el avance automático", () => {
    render(<OpinionesCarrusel />);

    // 8 opiniones, 4 visibles → 4 pasos llegan al final; el siguiente vuelve a 0.
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("→"));
    }
    fireEvent.click(screen.getByText("→"));

    expect(getTrack().style.transform).toBe("translateX(0%)");
  });
});

import "@testing-library/jest-dom/vitest";
import { vi, beforeEach } from "vitest";
import React from "react";

// ─────────────────────────────────────────
// Mock global de next/navigation.
// Los tests individuales sobrescriben el comportamiento con:
//   useRouter.mockReturnValue({ push, replace })
// ─────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/"),
}));

// next/image → <img> simple (jsdom no soporta la optimización de Next)
vi.mock("next/image", () => ({
  default: (props) =>
    React.createElement("img", { ...props, alt: props.alt || "" }),
}));

// next/link → <a> simple
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) =>
    React.createElement("a", { href, ...rest }, children),
}));

// Limpiar historial de mocks y localStorage entre cada test.
// NOTA: clearAllMocks limpia .calls/.results pero NO las implementaciones,
// así que cada beforeEach del archivo de test puede sobrescribir con mockReturnValue.
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

import { describe, it, expect } from "vitest";
import { validarPassword } from "@/lib/validarPassword";

describe("validarPassword", () => {
  it("rechaza contraseñas con menos de 7 caracteres aunque tengan 2 números", () => {
    expect(validarPassword("ab12")).toBe(false);
  });

  it("rechaza contraseñas con 7+ caracteres pero menos de 2 números", () => {
    expect(validarPassword("abcdef1")).toBe(false);
  });

  it("rechaza contraseñas sin ningún número", () => {
    expect(validarPassword("abcdefgh")).toBe(false);
  });

  it("acepta contraseñas con 7+ caracteres y al menos 2 números", () => {
    expect(validarPassword("abcde12")).toBe(true);
  });

  it("acepta contraseñas con más de 2 números y más de 7 caracteres", () => {
    expect(validarPassword("abc123456")).toBe(true);
  });

  it("rechaza una cadena vacía", () => {
    expect(validarPassword("")).toBe(false);
  });

  it("acepta cuando los números están al inicio, en medio o al final", () => {
    expect(validarPassword("12abcde")).toBe(true);
    expect(validarPassword("ab1cd2e")).toBe(true);
    expect(validarPassword("abcde12")).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { validarPassword } from "@/lib/validarPassword";

describe("validarPassword", () => {
  it("rechaza contraseñas con menos de 8 caracteres", () => {
    expect(validarPassword("Ab1!@34")).toBe(false);
  });

  it("rechaza contraseñas sin mayúscula", () => {
    expect(validarPassword("abcde12!")).toBe(false);
  });

  it("rechaza contraseñas sin minúscula", () => {
    expect(validarPassword("ABCDE12!")).toBe(false);
  });

  it("rechaza contraseñas sin ningún número", () => {
    expect(validarPassword("Abcdefgh!")).toBe(false);
  });

  it("rechaza contraseñas sin carácter especial", () => {
    expect(validarPassword("Abcdef12")).toBe(false);
  });

  it("rechaza una cadena vacía", () => {
    expect(validarPassword("")).toBe(false);
  });

  it("acepta contraseñas con 8+ caracteres, mayúscula, minúscula, número y símbolo", () => {
    expect(validarPassword("Abcdef12!")).toBe(true);
    expect(validarPassword("!Ab1cd2eF")).toBe(true);
    expect(validarPassword("P4ssw0rd$")).toBe(true);
  });
});
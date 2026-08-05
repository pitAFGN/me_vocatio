"use client";

import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

/**
 * Hook de autenticación.
 * Encapsula la lógica de login, registro, logout y recuperación de contraseña.
 * Los componentes llaman a estas funciones sin saber cómo funciona el backend.
 */
export function useAuth() {
  const router = useRouter();

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  };

  const register = async (name, email, password, captchaToken) => {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        captchaToken // <-- ¡Asegúrate de incluir esta propiedad aquí!
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrarse");
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const forgotPassword = async (email) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (token, newPassword) => {
    await authService.resetPassword(token, newPassword);
    router.push("/login");
  };

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  return { login, register, logout, forgotPassword, resetPassword, getToken };
}

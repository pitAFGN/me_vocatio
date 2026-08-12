"use client";

import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { supabase } from "@/lib/supabase";

/**
 * Decodifica el payload (parte del medio) de un JWT sin validar la firma.
 * Solo se usa para leer la fecha de expiración (`exp`).
 */
function decodificarPayloadJWT(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch {
    return null;
  }
}

/**
 * Indica si el token de sesión guardado en localStorage expiró.
 * Si no hay token o no tiene fecha de expiración, lo considera expirado
 * (así nunca se confía en un token sin control de vencimiento).
 */
export function sessionExpirada() {
  if (typeof window === "undefined") return true;
  const token = localStorage.getItem("token");
  if (!token) return true;
  const payload = decodificarPayloadJWT(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

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
    const data = await authService.register(name, email, password, captchaToken);
    return data;
  };

  const googleLogin = async (email, name, accessToken) => {
    const data = await authService.googleSync(email, name, accessToken);
    localStorage.setItem("token", data.token);
    router.replace("/dashboard");
  };

  const logout = async () => {
    localStorage.removeItem("token");
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Si falla la sesión de Supabase, el token local ya fue limpiado.
      }
    }
    router.replace("/login");
  };

  const forgotPassword = async (email) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (token, newPassword) => {
    await authService.resetPassword(token, newPassword);
    router.push("/login");
  };

  const verifyEmail = async (token) => {
    return await authService.verifyEmail(token);
  };

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  return { login, register, logout, forgotPassword, resetPassword, verifyEmail, getToken };
}

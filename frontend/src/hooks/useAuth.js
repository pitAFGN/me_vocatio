"use client";

import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { getSupabase } from "@/lib/supabase";

export function sessionExpirada() {
  return false;
}

/**
 * Hook de autenticación.
 * Encapsula la lógica de login, registro, logout y recuperación de contraseña.
 */
export function useAuth() {
  const router = useRouter();

  const login = async (email, password) => {
    await authService.login(email, password);

    window.dispatchEvent(new Event("local-storage-update"));

    router.push("/dashboard");
  };

  const register = async (name, email, password, captchaToken) => {
    const data = await authService.register(name, email, password, captchaToken);
    return data;
  };

  const googleLogin = async (email, name, accessToken) => {
    await authService.googleSync(email, name, accessToken);

    window.dispatchEvent(new Event("local-storage-update"));

    router.replace("/dashboard");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // La redirección también evita dejar la interfaz en estado autenticado.
    }

    // Notificar limpieza de sesión
    window.dispatchEvent(new Event("local-storage-update"));

    try {
      const sb = await getSupabase();
      if (sb) {
        await sb.auth.signOut();
      }
    } catch {
      // Si falla la sesión de Supabase, el token local ya fue limpiado.
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

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    googleLogin,
    me: authService.me,
  };
}
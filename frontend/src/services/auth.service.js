import { API_URL } from "@/lib/constants";

/**
 * Servicio de autenticación.
 * Centraliza todas las llamadas al backend relacionadas con auth.
 * Las páginas NO deben usar fetch directamente — siempre llaman a este servicio.
 */

export const authService = {
  /**
   * Inicia sesión y retorna el token JWT.
   */
  async login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Credenciales inválidas");
    return data; // { token }
  },

  /**
   * Registra un nuevo usuario.
   */
  async register(name, email, password, captchaToken) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, captchaToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Error al registrar");
    return data; // { id, name, email }
  },

  /**
   * Sincroniza la sesión de Google (Supabase) con el backend y devuelve el JWT de MeVocatio.
   */
  async googleSync(email, name, accessToken) {
    const res = await fetch(`${API_URL}/api/auth/google-sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Error al iniciar sesión con Google");
    return data; // { token }
  },

  /**
   * Envía el correo de recuperación de contraseña.
   */
  async forgotPassword(email) {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo enviar el correo");
    return data;
  },

  /**
   * Cambia la contraseña usando el token del correo.
   */
  async resetPassword(token, newPassword) {
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Token inválido o expirado");
    return data;
  },
};

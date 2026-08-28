import { API_URL } from "@/lib/constants";

/**
 * Servicio de autenticación.
 * Centraliza todas las llamadas al backend relacionadas con auth.
 */
export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Credenciales inválidas");
    return data;
  },

  async register(name, email, password, captchaToken) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, captchaToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Error al registrar");
    return data;
  },

  async googleSync(email, name, accessToken) {
    const res = await fetch(`${API_URL}/api/auth/google-sync`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Error al iniciar sesión con Google");
    return data;
  },

  async me() {
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Sesión no válida");
    return data;
  },

  async refresh() {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Sesión expirada");
    return data;
  },

  async logout() {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("No se pudo cerrar la sesión");
  },

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

  async verifyEmail(token) {
    const res = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`, {
      method: "GET",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "El enlace es inválido o expiró.");
    return data;
  },

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
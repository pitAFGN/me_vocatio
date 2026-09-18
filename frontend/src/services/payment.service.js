import { API_URL } from "@/lib/constants";

/**
 * Servicio de pagos.
 * Igual que auth.service.js: solo habla con el backend, nada más.
 * Todas las rutas necesitan la sesión del usuario logueado (cookie HttpOnly),
 * por eso se envía siempre `credentials: "include"`.
 */
async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Error en la petición de pago");
  return data;
}

export const paymentService = {
  /**
   * Inicia el pago del Plan Premium.
   * El backend responde con { pago, widget } y con "widget"
   * es con lo que se abre el checkout de Wompi.
   */
  async crearPagoPremium() {
    return requestJson(`${API_URL}/api/pagos/premium`, {
      method: "POST",
    });
  },

  async misPagos() {
    return requestJson(`${API_URL}/api/pagos/mios`);
  },

  async reconsultarEstado(id) {
    return requestJson(`${API_URL}/api/pagos/${id}/reconsultar`);
  },
};
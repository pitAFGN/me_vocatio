import { API_URL } from "@/lib/constants";

/**
 * Servicio de pagos.
 * Igual que auth.service.js: solo habla con el backend, nada más.
 * Todas las rutas necesitan el token del usuario logueado.
 */
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const paymentService = {
  /**
   * Crea el curso de pago + el intento de pago.
   * El backend responde con { curso, widget } y con "widget"
   * es con lo que se abre el checkout de Wompi.
   */
  async crearPago(datosCurso) {
    const res = await fetch(`${API_URL}/api/payment/crear`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(datosCurso),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo iniciar el pago");
    return data;
  },

  async misPagos() {
    const res = await fetch(`${API_URL}/api/payment/mios`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar tus pagos");
    return data;
  },

  async obtenerPorId(id) {
    const res = await fetch(`${API_URL}/api/payment/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo obtener el pago");
    return data;
  },

  async reconsultarEstado(id) {
    const res = await fetch(`${API_URL}/api/payment/${id}/reconsultar`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo consultar el estado del pago");
    return data;
  },

  async cancelar(id) {
    const res = await fetch(`${API_URL}/api/payment/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo cancelar el pago");
    return data;
  },
};

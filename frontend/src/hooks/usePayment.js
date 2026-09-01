"use client";

import { useState, useCallback } from "react";

/**
 * usePayment (STUB / RELLENO TEMPORAL)
 * ------------------------------------------------------------------
 * Este hook existe solo para que "Publicar y pagar con Wompi" compile
 * y no rompa el build de Next.js mientras se implementa la integración
 * real con la pasarela de pagos.
 *
 * NO procesa pagos de verdad. Cuando se llame a pagarCurso(), simplemente
 * simula un breve estado de carga y luego dispara onError(...) avisando
 * que la pasarela todavía no está conectada.
 *
 * Cuando implementes la integración real con Wompi, reemplaza el cuerpo
 * de pagarCurso() por la llamada real (por ejemplo, abrir el widget de
 * Wompi o hacer fetch a tu backend para crear la transacción), y llama a
 * onExito() / onError(msg) / onCerrado() según corresponda. La forma en
 * que este hook se usa desde creacion_recursos/page.js NO tiene que
 * cambiar.
 * ------------------------------------------------------------------
 */
export function usePayment() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const pagarCurso = useCallback((datosCurso, callbacks = {}) => {
    const { onExito, onError, onCerrado } = callbacks;

    setError(null);
    setCargando(true);

    // TODO: reemplazar este setTimeout por la integración real con Wompi.
    // Por ejemplo: abrir el widget de Wompi con datosCurso, o hacer un
    // fetch a tu backend (POST /api/pagos) para crear la transacción.
    setTimeout(() => {
      setCargando(false);
      const mensaje =
        "La pasarela de pago (Wompi) todavía no está conectada. " +
        "Esta es una versión de relleno de usePayment.js.";
      setError(mensaje);

      if (onError) {
        onError(mensaje);
      } else if (onCerrado) {
        onCerrado();
      }
    }, 600);
  }, []);

  return { pagarCurso, cargando, error };
}

export default usePayment;
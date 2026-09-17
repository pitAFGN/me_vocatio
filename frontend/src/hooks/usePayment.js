"use client";

import { useState, useCallback } from "react";
import { paymentService } from "@/services/payment.service";
import { abrirCheckoutWompi } from "@/lib/wompi";

/**
 * usePayment
 * ------------------------------------------------------------------
 * Integración real con la pasarela de pagos Wompi.
 *
 * - pagarCurso(datosCurso, callbacks): crea un curso de pago en el
 *   backend (POST /api/pagos/crear) y abre el widget de Wompi.
 * - pagarPremium(callbacks): activa el pago del Plan Premium
 *   (POST /api/pagos/premium) y abre el widget de Wompi.
 *
 * callbacks: { onExito(transaction), onError(mensaje), onCerrado() }
 * ------------------------------------------------------------------
 */

const ESTADOS_APROBADOS = ["APPROVED", "APPROVED_PENDING"];

export function usePayment() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const abrirWidget = useCallback(async (widget, callbacks = {}) => {
    const { onExito, onError, onCerrado } = callbacks;

    try {
      await abrirCheckoutWompi(widget, (transaction) => {
        const estado = transaction?.status;
        if (!transaction || !estado) {
          onCerrado?.();
          return;
        }

        if (ESTADOS_APROBADOS.includes(estado)) {
          onExito?.(transaction);
        } else {
          onError?.(`El pago no fue aprobado (${estado}).`);
        }
      });
      
      // Una vez que el widget se ha abierto exitosamente, ya no estamos "cargando"
      setCargando(false);
    } catch (err) {
      setCargando(false);
      const msg = err?.message || "No se pudo abrir la pasarela de pago.";
      setError(msg);
      onError?.(msg);
    }
  }, []);

  const iniciarPago = useCallback(
    async (promesa, callbacks = {}) => {
      const { onError } = callbacks;
      setError(null);
      setCargando(true);
      try {
        const { widget } = await promesa;
        await abrirWidget(widget, callbacks);
      } catch (err) {
        setCargando(false);
        const msg = err?.message || "No se pudo iniciar el pago.";
        setError(msg);
        onError?.(msg);
      }
    },
    [abrirWidget]
  );

  const pagarCurso = useCallback(
    (datosCurso, callbacks = {}) =>
      iniciarPago(paymentService.crearPago(datosCurso), callbacks),
    [iniciarPago]
  );

  const pagarPremium = useCallback(
    (callbacks = {}) => iniciarPago(paymentService.crearPagoPremium(), callbacks),
    [iniciarPago]
  );

  return { pagarCurso, pagarPremium, cargando, error };
}

export default usePayment;
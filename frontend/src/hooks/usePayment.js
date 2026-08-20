"use client";

import { useState } from "react";
import { paymentService } from "@/services/payment.service";
import { abrirCheckoutWompi } from "@/lib/wompi";

/**
 * Hook de pagos.
 * pagarCurso(datosCurso) hace TODO el paso a paso:
 *   1. Le pide al backend que cree el curso + el intento de pago
 *   2. Abre la ventana de pago de Wompi con esos datos
 *   3. Cuando el usuario termina, avisa si quedó pagado o no
 */
export function usePayment() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const pagarCurso = async (datosCurso, { onExito, onError, onCerrado } = {}) => {
    setError(null);
    setCargando(true);
    try {
      const { curso, widget } = await paymentService.crearPago(datosCurso);

      await abrirCheckoutWompi(widget, async (transaction) => {
        if (!transaction) {
          onCerrado?.();
          return;
        }

        if (transaction.status === "APPROVED") {
          onExito?.({ curso, transaction });
        } else {
          onError?.(`El pago no se aprobó (estado: ${transaction.status}).`);
        }
      });
    } catch (err) {
      const mensaje = err.message || "No se pudo iniciar el pago";
      setError(mensaje);
      onError?.(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return { pagarCurso, cargando, error };
}

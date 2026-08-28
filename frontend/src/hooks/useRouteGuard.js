"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

/**
 * Hook para obtener el estado actual de la sesión de forma segura en cliente
 */
function useEstadoSesion() {
  const [esValida, setEsValida] = useState(null); // null = cargando/SSR

  useEffect(() => {
    let activo = true;
    const comprobarSesion = async () => {
      try {
        await authService.me();
        if (activo) setEsValida(true);
      } catch {
        try {
          await authService.refresh();
          await authService.me();
          if (activo) setEsValida(true);
        } catch {
          if (activo) setEsValida(false);
        }
      }
    };
    comprobarSesion();

    // Escuchar cambios de storage (entre pestañas y eventos manuales)
    const ManejarCambio = () => comprobarSesion();
    window.addEventListener("storage", ManejarCambio);
    window.addEventListener("local-storage-update", ManejarCambio);

    return () => {
      window.removeEventListener("storage", ManejarCambio);
      window.removeEventListener("local-storage-update", ManejarCambio);
      activo = false;
    };
  }, []);

  return esValida;
}

/**
 * Protege rutas privadas (ej. /dashboard)
 */
export function useProtectedRoute() {
  const router = useRouter();
  const sesionValida = useEstadoSesion();

  useEffect(() => {
    if (sesionValida === false) {
      router.replace("/login");
    }
  }, [sesionValida, router]);

  return { loading: sesionValida === null };
}

/**
 * Protege rutas de autenticación (SÓLO /login o /registro)
 * Si ya tiene sesión, lo manda al dashboard.
 */
export function usePublicRoute() {
  const router = useRouter();
  const sesionValida = useEstadoSesion();

  useEffect(() => {
    if (sesionValida === true) {
      router.replace("/dashboard");
    }
  }, [sesionValida, router]);

  return { loading: sesionValida === null };
}
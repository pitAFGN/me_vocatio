"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { sessionExpirada } from "@/hooks/useAuth";

/**
 * Lee de forma reactiva si hay una sesión válida en localStorage.
 * Devuelve:
 *  - `true`  → hay token vigente (menos de 24h)
 *  - `false` → no hay token o ya expiró
 *  - `null`  → aún no se puede saber (render del servidor)
 */
function suscribir(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function obtenerSnapshot() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return Boolean(token && !sessionExpirada());
}

const snapshotServidor = () => null;

function useSesionValida() {
  return useSyncExternalStore(suscribir, obtenerSnapshot, snapshotServidor);
}

/**
 * Protege una ruta privada.
 * Si no hay token o este expiró (24h), redirige al login.
 * Retorna `loading` para evitar que la página se muestre antes de verificar.
 *
 * Uso: const { loading } = useProtectedRoute();
 */
export function useProtectedRoute() {
  const router = useRouter();
  const sesionValida = useSesionValida();

  useEffect(() => {
    if (sesionValida === false) {
      router.replace("/login");
    }
  }, [sesionValida, router]);

  const loading = sesionValida !== true;
  return { loading };
}

/**
 * Protege una ruta pública (login, landing).
 * Si hay un token vigente (menos de 24h), redirige al dashboard.
 * Retorna `loading` para evitar flasheos visuales.
 *
 * Uso: const { loading } = usePublicRoute();
 */
export function usePublicRoute() {
  const router = useRouter();
  const sesionValida = useSesionValida();

  useEffect(() => {
    if (sesionValida === true) {
      router.replace("/dashboard");
    }
  }, [sesionValida, router]);

  const loading = sesionValida !== false;
  return { loading };
}

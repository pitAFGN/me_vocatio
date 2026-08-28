"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

/**
 * Estado reactivo de la sesión.
 *
 * - `null`: aún sin verificar (SSR o primer render del cliente)
 * - `true` / `false`: resultado tras comprobar en el cliente
 *
 * Escucha cambios de localStorage para mantenerse sincronizado tanto
 * entre pestañas (`storage`) como ante eventos propios de la app
 * (`local-storage-update`, p. ej. tras login o logout).
 */
function useSesionValida() {
  const [sesionValida, setSesionValida] = useState(null);

  useEffect(() => {
    let activo = true;
    const comprobarSesion = async () => {
      try {
        await authService.me();
        if (activo) setSesionValida(true);
      } catch {
        try {
          await authService.refresh();
          await authService.me();
          if (activo) setSesionValida(true);
        } catch {
          if (activo) setSesionValida(false);
        }
      }
    };
    comprobarSesion();

    // Escuchar cambios de storage (entre pestañas y eventos manuales)
    const actualizarSesion = () => comprobarSesion();
    window.addEventListener("storage", actualizarSesion);
    window.addEventListener("local-storage-update", actualizarSesion);

    return () => {
      window.removeEventListener("storage", actualizarSesion);
      window.removeEventListener("local-storage-update", actualizarSesion);
      activo = false;
    };
  }, []);

  return sesionValida;
}

/**
 * Protege rutas privadas (ej. /dashboard).
 * Bloquea el render hasta confirmar la sesión y redirige a /login cuando el
 * usuario no está autenticado, evitando mostrar contenido privado a visitantes
 * sin sesión activa.
 */
export function useProtectedRoute() {
  const router = useRouter();
  const sesionValida = useSesionValida();

  useEffect(() => {
    if (sesionValida === false) {
      router.replace("/login");
    }
  }, [sesionValida, router]);

  // Bloquea el render (loading=true) mientras la sesión no esté confirmada
  // (aún verificando `null` o inválida `false`), de modo que las páginas
  // protegidas no muestren su contenido privado antes de redirigir.
  return { loading: sesionValida !== true };
}

/**
 * Protege rutas públicas (landing `/` y `/login`).
 * No bloquea el render: pinta el contenido de inmediato y solo redirige al
 * dashboard cuando ya existe una sesión válida. Así se elimina el parpadeo de
 * "Cargando/Verificando..." y se acelera el primer pintado sin tocar los 3D.
 */
export function usePublicRoute() {
  const router = useRouter();
  const sesionValida = useSesionValida();

  useEffect(() => {
    if (sesionValida === true) {
      router.replace("/dashboard");
    }
  }, [sesionValida, router]);

  return { loading: false };
}

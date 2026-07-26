"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Protege una ruta privada.
 * Si no hay token, redirige al login.
 * Retorna `loading` para evitar que la página se muestre antes de verificar.
 *
 * Uso: const { loading } = useProtectedRoute();
 */
export function useProtectedRoute() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  return { loading };
}

/**
 * Protege una ruta pública (login, landing).
 * Si ya hay token, redirige al dashboard.
 * Retorna `loading` para evitar flasheos visuales.
 *
 * Uso: const { loading } = usePublicRoute();
 */
export function usePublicRoute() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  return { loading };
}

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

// El login con Google se habilita solo si están configuradas las credenciales de Supabase.
export const isGoogleLoginEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabaseInstance = null;

// Cliente lazy: @supabase/supabase-js solo se descarga cuando hay una acción real
// de Google (login o logout). Así no pesa el bundle de todas las páginas.
// flowType "pkce" es requerido por el flujo OAuth con sesión por cookies del backend.
export async function getSupabase() {
  if (!isGoogleLoginEnabled) return null;
  if (supabaseInstance) return supabaseInstance;
  const { createClient } = await import("@supabase/supabase-js");
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { flowType: "pkce" },
  });
  return supabaseInstance;
}

// Escoba digital para limpiar cualquier residuo en el LocalStorage
export function clearSupabaseLocalStorage() {
  if (typeof window === "undefined") return;
  
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sb-")) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

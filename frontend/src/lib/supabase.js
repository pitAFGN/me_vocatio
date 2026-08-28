import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

// El login con Google se habilita solo si están configuradas las credenciales de Supabase.
export const isGoogleLoginEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabaseInstance = null;

// Cliente lazy: @supabase/supabase-js solo se descarga cuando hay una acción real
// de Google (login o logout). Así no pesa el bundle de todas las páginas.
export async function getSupabase() {
  if (!isGoogleLoginEnabled) return null;
  if (supabaseInstance) return supabaseInstance;
  const { createClient } = await import("@supabase/supabase-js");
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseInstance;
}
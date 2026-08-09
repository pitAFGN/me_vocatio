import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

// El login con Google se habilita solo si están configuradas las credenciales de Supabase.
export const isGoogleLoginEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isGoogleLoginEnabled
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

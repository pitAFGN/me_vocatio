// Todas las URLs de la API se definen aquí.
// Para cambiar el backend solo se modifica este archivo (o .env).
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Clave pública de Google reCAPTCHA (viene del .env.local del frontend).
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// Credenciales públicas de Supabase (login con Google).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

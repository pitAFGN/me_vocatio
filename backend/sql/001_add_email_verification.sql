-- ─────────────────────────────────────────────────────────
-- Migración: Verificación de correo electrónico (Magic Link)
-- Proyecto: MeVocatio
-- ─────────────────────────────────────────────────────────
-- Ejecutar una sola vez contra la base de datos (Neon/Postgres).
-- Puedes correrlo desde el SQL editor de Neon, psql, o cualquier
-- cliente de Postgres conectado a tu DATABASE_URL.

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS verification_token_hash VARCHAR(64) NULL,
  ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ NULL;

-- Índice para que la búsqueda del token al verificar sea O(1)/rápida
CREATE INDEX IF NOT EXISTS idx_users_verification_token_hash
  ON users (verification_token_hash);

-- (Opcional pero recomendado) Si ya tienes usuarios registrados antes de
-- este cambio, decide qué hacer con ellos. Por defecto quedan con
-- email_verified = false y no podrán loguearse hasta verificar.
-- Si prefieres marcarlos como ya verificados (para no romper cuentas
-- existentes de antes de este cambio), descomenta la siguiente línea:
--
-- UPDATE users SET email_verified = true, email_verified_at = NOW()
--   WHERE created_at < NOW(); -- ajusta la condición a tu caso

COMMIT;

-- ─────────────────────────────────────────────────────────
-- Migración: Tokens de recuperación de contraseña seguros
-- Proyecto: MeVocatio
-- ─────────────────────────────────────────────────────────

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_password_token_hash VARCHAR(64) NULL,
  ADD COLUMN IF NOT EXISTS reset_password_token_expires TIMESTAMPTZ NULL;

CREATE INDEX IF NOT EXISTS idx_users_reset_password_token_hash
  ON users (reset_password_token_hash);

COMMIT;


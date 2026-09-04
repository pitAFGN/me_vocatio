-- ─────────────────────────────────────────────────────────
-- Migración: Añadir campo de plan (free/premium) a la tabla users
-- Proyecto: MeVocatio
-- ─────────────────────────────────────────────────────────

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS plan VARCHAR(20) NOT NULL DEFAULT 'free';

COMMIT;


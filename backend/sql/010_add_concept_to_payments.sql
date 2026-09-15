-- ─────────────────────────────────────────────────────────
-- Migración: Distinguir el concepto de cada pago
-- Proyecto: MeVocatio
-- ─────────────────────────────────────────────────────────
-- Ejecutar desde la carpeta backend/:
--   node sql/run-migration.js 010_add_concept_to_payments.sql
--
-- Un pago puede ser:
--   'curso'   -> pago para publicar un curso de pago (course_id NO NULL)
--   'premium' -> pago para activar el Plan Premium (course_id NULL,
--                al aprobarse se actualiza users.plan = 'premium')

BEGIN;

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS concept VARCHAR(20) NOT NULL DEFAULT 'curso';

CREATE INDEX IF NOT EXISTS idx_payments_concept ON payments (concept);

COMMIT;
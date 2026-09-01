-- ─────────────────────────────────────────────────────────
-- Migración: Sistema de pagos con Wompi (creación de cursos)
-- Proyecto: MeVocatio
-- ─────────────────────────────────────────────────────────
-- Ejecutar desde la carpeta backend/:
--   node sql/run-migration.js 003_add_payment_system.sql

BEGIN;

-- 1) Los cursos ahora pueden ser gratuitos o de pago.
--    - is_paid: si el curso es de pago o no
--    - price: precio en pesos colombianos (COP), 0 si es gratuito
--    - payment_status: estado del pago asociado a la CREACIÓN del curso
--        no_aplica -> curso gratuito, no requiere pago
--        pendiente -> curso de pago, esperando que el instructor pague
--        pagado    -> curso de pago, ya pagado y publicado
--        fallido   -> el pago fue rechazado, declinado o expiró
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'no_aplica';

-- 2) Registro de cada intento de pago (uno por curso de pago que se quiere crear).
--    "reference" es un código único que nosotros generamos y le mandamos a Wompi;
--    así sabemos a qué pago corresponde cada evento que Wompi nos avise.
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  reference VARCHAR(100) NOT NULL UNIQUE,
  wompi_transaction_id VARCHAR(255),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'COP',
  status VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente | pagado | fallido | cancelado | reembolsado
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Log de eventos de Wompi ya procesados (webhooks).
--    Evita procesar el mismo evento dos veces si Wompi lo reenvía (puede pasar).
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  event_key VARCHAR(255) NOT NULL UNIQUE, -- combinación transactionId + timestamp del evento
  type VARCHAR(100) NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON payments (course_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments (reference);
CREATE INDEX IF NOT EXISTS idx_courses_payment_status ON courses (payment_status);

COMMIT;

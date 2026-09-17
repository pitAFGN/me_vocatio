-- 014_add_course_rejection.sql
-- Agrega la columna rejection_reason a courses para el flujo editorial:
-- cuando un admin rechaza un curso, se guarda el motivo que luego se muestra
-- al autor y se envía en el correo de rechazo.
--
-- Ejecutar desde backend/:
--   node sql/run-migration.js 014_add_course_rejection.sql

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

COMMENT ON COLUMN courses.rejection_reason IS
  'Motivo de rechazo del admin en el flujo editorial (NULL si nunca fue rechazado).';
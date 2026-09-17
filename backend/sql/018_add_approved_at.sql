-- 018_add_approved_at.sql
-- Rastrea cuándo el admin aprobó un curso. Es la puerta que habilita al autor
-- a ocultar/mostrar (borrado lógico) SOLO en cursos que ya pasaron por aprobación.
-- Al rechazar se limpia approved_at para que un curso rechazado vuelva a exigir
-- aprobación del admin antes de poder mostrarse de nuevo.
--
-- Ejecutar desde backend/:
--   node sql/run-migration.js 018_add_approved_at.sql

ALTER TABLE courses ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

UPDATE courses
   SET approved_at = updated_at
 WHERE status IN ('activo', 'published')
   AND approved_at IS NULL;
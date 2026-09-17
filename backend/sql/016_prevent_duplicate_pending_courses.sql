-- 016_prevent_duplicate_pending_courses.sql
-- Evita que un instructor pueda crear más de un curso en 'revision' con el
-- mismo título (spam/click repetido al guardar). El índice es PARCIAL: solo
-- aplica mientras el curso siga pendiente de revisión; al aprobarse o
-- rechazarse el curso sale del índice y el autor puede reutilizar el título.
--
-- Ejecutar desde backend/:
--   node sql/run-migration.js 016_prevent_duplicate_pending_courses.sql

CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_pending_revision
  ON courses (instructor_id, LOWER(title))
  WHERE status = 'revision';
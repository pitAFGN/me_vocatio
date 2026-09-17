-- 017_strengthen_pending_course_duplicate_guard.sql
-- Refuerza el candado contra duplicados pendientes:
--  * Amplía el índice a 'revision' Y 'rechazado' (un autor no puede tener dos
--    copias del mismo curso en el limbo editorial).
--  * Normaliza el título (minúsculas, sin tildes, sin puntuación) para que
--    variantes tipo "AutoCad" / "autocad" / "auto-cad" colisionen igual.
--
-- Nota: la garantía real de "es el mismo curso" es el id (modo edición en el
-- frontend). Este índice es el candado extra a prueba de spam/concurrencia.
--
-- Ejecutar desde backend/:
--   node sql/run-migration.js 017_strengthen_pending_course_duplicate_guard.sql

CREATE OR REPLACE FUNCTION normalizar_titulo_curso(t TEXT)
RETURNS TEXT AS $$
  SELECT lower(regexp_replace(translate(t,
    'áàäâãéèëêíìïîóòöôõúùüûñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ',
    'aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC'),
    '[^a-z0-9]', '', 'g'))
$$ LANGUAGE SQL IMMUTABLE;

DROP INDEX IF EXISTS idx_courses_pending_revision;

CREATE UNIQUE INDEX idx_courses_pending_revision
  ON courses (instructor_id, normalizar_titulo_curso(title))
  WHERE status IN ('revision', 'rechazado');
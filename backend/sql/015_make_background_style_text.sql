-- 015_make_background_style_text.sql
-- El fondo de la carta del curso ahora puede ser la URL de una imagen,
-- que supera fácilmente los 100 caracteres de VARCHAR(100). Se amplía a TEXT.
--
-- Ejecutar desde backend/:
--   node sql/run-migration.js 015_make_background_style_text.sql

ALTER TABLE courses
  ALTER COLUMN background_style TYPE TEXT;
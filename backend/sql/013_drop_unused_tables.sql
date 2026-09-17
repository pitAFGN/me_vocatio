-- ─────────────────────────────────────────────────────────
-- Migración: Eliminación de tablas sin uso
--   Tablas creadas por migraciones previas que el backend
--   NUNCA consulta (verificado contra rutas y servicios).
--   - Sin vistas ni triggers dependientes.
--   - courses.category_id es una FK vestigial hacia
--     categories; el código usa courses.category (texto).
-- ─────────────────────────────────────────────────────────

BEGIN;

-- Suelta primero la FK vestigial de courses hacia categories
ALTER TABLE courses DROP COLUMN IF EXISTS category_id;

-- evaluation_answers apunta a evaluation_questions (FK interna)
DROP TABLE IF EXISTS evaluation_answers;
DROP TABLE IF EXISTS evaluation_questions;

DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS official_resources;

COMMIT;
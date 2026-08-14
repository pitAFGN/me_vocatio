-- ─────────────────────────────────────────────────────────
-- Migración: Cursos vocacionales (CRUD)
-- Proyecto: MeVocatio
-- ─────────────────────────────────────────────────────────
-- Ejecutar una sola vez contra la base de datos (Neon/Postgres).
-- Desde la carpeta backend/: node sql/run-migration.js sql/002_create_courses_table.sql

BEGIN;

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL DEFAULT 'Principiante',
  duration_hours INTEGER,
  modality VARCHAR(20) NOT NULL DEFAULT 'Virtual',
  status VARCHAR(20) NOT NULL DEFAULT 'activo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses (instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses (status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);

COMMIT;

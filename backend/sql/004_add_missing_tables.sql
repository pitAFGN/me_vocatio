-- ─────────────────────────────────────────────────────────
-- Migración: Tablas faltantes de MeVocatio
--   (evaluaciones, contenido de cursos, inscripciones,
--    progreso, reseñas)
--   NOTA: las secciones de categories, evaluation_questions,
--   evaluation_answers, user_profiles y notifications fueron
--   eliminadas porque esas tablas fueron borradas en la
--   migración 013 (estaban sin uso en el backend).
-- ─────────────────────────────────────────────────────────
-- Ejecutar desde la carpeta backend/:
--   node sql/run-migration.js 004_add_missing_tables.sql

BEGIN;

-- ═══════════════════════════════════════════════════════
-- 1) EVALUATIONS
--    Ya la usa tu código (recomendation.service.js) pero
--    todavía no existía en la base de datos. Sin esto, el
--    test vocacional falla al querer guardar el resultado.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS evaluations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profession_title VARCHAR(150) NOT NULL,
  level VARCHAR(20) NOT NULL DEFAULT 'Intermedio',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations (user_id);

-- ═══════════════════════════════════════════════════════
-- 2) LESSONS
--    El contenido real de un curso (clases/módulos). Sin
--    esto, un curso es solo un título y una descripción.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content TEXT,
  video_url VARCHAR(500),
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons (course_id);

-- ═══════════════════════════════════════════════════════
-- 3) ENROLLMENTS
--    Qué estudiante se inscribió a qué curso.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'activo', -- activo | completado | cancelado
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments (course_id);

-- ═══════════════════════════════════════════════════════
-- 4) COURSE_PROGRESS
--    Qué lecciones ya completó cada estudiante inscrito.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS course_progress (
  id SERIAL PRIMARY KEY,
  enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (enrollment_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_course_progress_enrollment_id
  ON course_progress (enrollment_id);

-- ═══════════════════════════════════════════════════════
-- 5) REVIEWS
--    Calificación y comentario de un estudiante sobre un curso.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews (course_id);

COMMIT;
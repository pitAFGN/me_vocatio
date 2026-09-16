-- ─────────────────────────────────────────────────────────
-- Migración: Tablas faltantes de MeVocatio
--   (evaluaciones, contenido de cursos, inscripciones,
--    progreso, categorías, reseñas, perfiles, notificaciones)
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
-- 2) EVALUATION_QUESTIONS
--    Las preguntas que genera la IA (Groq) para cada test,
--    guardadas para no perderlas y poder revisarlas después.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS evaluation_questions (
  id SERIAL PRIMARY KEY,
  evaluation_id INTEGER NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  dificultad VARCHAR(20) NOT NULL DEFAULT 'Intermedio', -- Principiante | Intermedio | Avanzado
  opciones JSONB NOT NULL,          -- ej: ["Opción A", "Opción B", "Opción C", "Opción D"]
  opcion_correcta_idx INTEGER NOT NULL,
  puntos INTEGER NOT NULL DEFAULT 1,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluation_questions_evaluation_id
  ON evaluation_questions (evaluation_id);

-- ═══════════════════════════════════════════════════════
-- 3) EVALUATION_ANSWERS
--    Lo que respondió el usuario en cada pregunta del test.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS evaluation_answers (
  id SERIAL PRIMARY KEY,
  evaluation_id INTEGER NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES evaluation_questions(id) ON DELETE CASCADE,
  selected_idx INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (evaluation_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_evaluation_answers_evaluation_id
  ON evaluation_answers (evaluation_id);

-- ═══════════════════════════════════════════════════════
-- 4) CATEGORIES
--    Hoy "courses.category" es texto libre. Con esta tabla
--    evitas duplicados como "Tecnologia" vs "Tecnología".
--    category_id es opcional (nullable) para no romper los
--    cursos que ya tengan el texto libre en "category".
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);

CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses (category_id);

-- ═══════════════════════════════════════════════════════
-- 5) LESSONS
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
-- 6) ENROLLMENTS
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
-- 7) COURSE_PROGRESS
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
-- 8) REVIEWS
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

-- ═══════════════════════════════════════════════════════
-- 9) USER_PROFILES
--    Datos de perfil (bio, foto, titular) separados de
--    "users", que es solo para login/autenticación.
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  headline VARCHAR(150),
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- 10) NOTIFICATIONS
--     Avisos para el usuario ("tu curso fue aprobado", etc.)
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'general',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);

COMMIT;

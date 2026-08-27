BEGIN;

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  code VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(80) NOT NULL,
  category VARCHAR(50) NOT NULL,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  resources_created INTEGER NOT NULL DEFAULT 0,
  diagnostics_completed INTEGER NOT NULL DEFAULT 0,
  professions_viewed INTEGER NOT NULL DEFAULT 0,
  resources_viewed INTEGER NOT NULL DEFAULT 0,
  saved_professions INTEGER NOT NULL DEFAULT 0,
  current_login_streak INTEGER NOT NULL DEFAULT 0,
  longest_login_streak INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

INSERT INTO achievements (code, name, description, icon, category, requirement_type, requirement_value)
VALUES
  ('email_verified', 'Primer Paso', 'Verificaste tu correo electrónico.', 'badge-check', 'Cuenta', 'email_verified', 1),
  ('first_diagnostic', 'Diagnóstico Completado', 'Completaste tu primer diagnóstico.', 'star', 'Aprendizaje', 'diagnostics_completed', 1),
  ('first_resource', 'Creador de Recursos', 'Creaste tu primer recurso.', 'rocket', 'Creación', 'resources_created', 1),
  ('premium_member', 'Impulso Premium', 'Activaste una suscripción Premium.', 'crown', 'Membresía', 'premium_purchase', 1),
  ('explorer', 'Explorador Vocacional', 'Consultaste tres vocaciones diferentes.', 'compass', 'Exploración', 'professions_viewed', 3),
  ('focused', 'Enfoque Total', 'Obtuviste al menos 80% en un diagnóstico.', 'target', 'Aprendizaje', 'diagnostic_score', 80)
ON CONFLICT (code) DO NOTHING;

COMMIT;
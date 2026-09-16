-- 010_create_sessions.sql
-- Sesiones de refresh token persistentes en PostgreSQL.
-- Reemplaza el store en memoria/Redis: sobrevive reinicios y réplicas,
-- permite expiración real a nivel de BD y cierre de sesión de todo tipo.

CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id   ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
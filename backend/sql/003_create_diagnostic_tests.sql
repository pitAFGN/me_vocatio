BEGIN;

CREATE TABLE IF NOT EXISTS diagnostic_tests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profession_title VARCHAR(150) NOT NULL,
  questions JSONB NOT NULL,
  answer_key JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  evaluation_id INTEGER NULL REFERENCES evaluations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_tests_user_id ON diagnostic_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_tests_expiration ON diagnostic_tests(expires_at);

COMMIT;
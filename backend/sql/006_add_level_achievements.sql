-- Migración para añadir insignias por nivel
INSERT INTO achievements (code, name, description, icon, category, requirement_type, requirement_value)
VALUES
  ('level_5', 'Iniciado Vocacional', 'Alcanzaste el Nivel 5 en la plataforma.', 'shield', 'Progreso', 'user_level', 5),
  ('level_10', 'Explorador Dedicado', 'Alcanzaste el Nivel 10 en la plataforma.', 'award', 'Progreso', 'user_level', 10),
  ('level_25', 'Estratega de Carrera', 'Alcanzaste el Nivel 25 en la plataforma.', 'medal', 'Progreso', 'user_level', 25),
  ('level_50', 'Maestro de Vocación', 'Alcanzaste el Nivel 50 en la plataforma.', 'trophy', 'Progreso', 'user_level', 50)
ON CONFLICT (code) DO NOTHING;


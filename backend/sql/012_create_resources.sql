CREATE TABLE IF NOT EXISTS official_resources (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(100) NOT NULL,
    vocacion VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    estado VARCHAR(50) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


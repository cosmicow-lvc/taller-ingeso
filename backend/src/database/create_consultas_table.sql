
CREATE TABLE IF NOT EXISTS consultas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    asunto VARCHAR(500) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respondida BOOLEAN DEFAULT FALSE,
    respuesta TEXT,
    fecha_respuesta TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultas_email ON consultas(email);
CREATE INDEX IF NOT EXISTS idx_consultas_respondida ON consultas(respondida);
CREATE INDEX IF NOT EXISTS idx_consultas_fecha ON consultas(fecha_creacion DESC);

COMMENT ON TABLE consultas IS 'Almacena las consultas enviadas por clientes a través del formulario de contacto';
COMMENT ON COLUMN consultas.respondida IS 'Indica si la consulta ha sido respondida por un administrador';
COMMENT ON COLUMN consultas.fecha_respuesta IS 'Fecha en que se respondió la consulta';

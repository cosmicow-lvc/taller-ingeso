-- Tabla para almacenar usuarios registrados
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Almacena los usuarios registrados en la plataforma';
COMMENT ON COLUMN usuarios.password_hash IS 'Contraseña encriptada con bcrypt';
COMMENT ON COLUMN usuarios.activo IS 'Indica si la cuenta del usuario está activa';

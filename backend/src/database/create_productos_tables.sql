CREATE TABLE IF NOT EXISTS marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(160) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    id_marca INTEGER NOT NULL REFERENCES marcas(id),
    id_categoria INTEGER NOT NULL REFERENCES categorias(id),
    rating NUMERIC(3,1) DEFAULT 0,
    precio_base NUMERIC(10,2) NOT NULL,
    imagen_principal TEXT
);

CREATE INDEX IF NOT EXISTS idx_productos_marca ON productos(id_marca);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(id_categoria);

CREATE TABLE IF NOT EXISTS producto_variantes (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    clave VARCHAR(80) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    imagen TEXT,
    UNIQUE (producto_id, clave)
);

CREATE INDEX IF NOT EXISTS idx_variantes_producto ON producto_variantes(producto_id);

CREATE TABLE IF NOT EXISTS producto_resenas (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    usuario VARCHAR(120) NOT NULL,
    comentario TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    fecha_resena DATE DEFAULT CURRENT_DATE,
    UNIQUE (producto_id, usuario, fecha_resena)
);

CREATE INDEX IF NOT EXISTS idx_resenas_producto ON producto_resenas(producto_id);

CREATE TABLE IF NOT EXISTS compras (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'confirmada',
    monto_total DECIMAL(10, 2) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(500) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compras_fecha ON compras(fecha_compra DESC);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras(estado);

COMMENT ON TABLE compras IS 'Almacena las compras realizadas por los usuarios';
COMMENT ON COLUMN compras.estado IS 'Estado de la compra: pendiente, confirmada, entregada, cancelada';
COMMENT ON COLUMN compras.monto_total IS 'Monto total de la compra';

CREATE TABLE IF NOT EXISTS compra_lineas (
    id SERIAL PRIMARY KEY,
    compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL,
    variante_id VARCHAR(100),
    nombre_producto VARCHAR(255) NOT NULL,
    marca VARCHAR(100),
    categoria VARCHAR(100),
    precio_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    imagen TEXT
);

CREATE INDEX IF NOT EXISTS idx_compra_lineas_compra ON compra_lineas(compra_id);

COMMENT ON TABLE compra_lineas IS 'Líneas de detalle de cada compra';
COMMENT ON COLUMN compra_lineas.subtotal IS 'Precio unitario * cantidad';

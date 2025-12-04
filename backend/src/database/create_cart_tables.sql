-- Tablas para carrito de compras
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(10,2),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_carts_usuario ON carts(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_producto ON cart_items(producto_id);

COMMENT ON TABLE carts IS 'Carrito asociado a un usuario (temporal).';
COMMENT ON TABLE cart_items IS 'Items pertenecientes a un carrito de compras.';

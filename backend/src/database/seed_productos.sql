INSERT INTO marcas (nombre) VALUES
    ('Nova'),
    ('Orion'),
    ('Acme'),
    ('Zetta'),
    ('Tempest'),
    ('Cougar'),
    ('Newskill'),
    ('Asus'),
    ('Logitech'),
    ('Kensington'),
    ('Iggual'),
    ('HP'),
    ('Owlotech'),
    ('Epson'),
    ('Herman Miller'),
    ('Neumann'),
    ('Yamaha'),
    ('Audeze')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO categorias (nombre) VALUES
    ('Accesorios'),
    ('CAT 1'),
    ('CAT 2'),
    ('Teclados'),
    ('Sillas Gamer'),
    ('Mouse'),
    ('Escritorios'),
    ('Trackball'),
    ('Webcam'),
    ('Impresora'),
    ('Sillas Oficina'),
    ('Monitores Estudio'),
    ('Audifonos Estudio')
ON CONFLICT (nombre) DO NOTHING;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Nova'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Accesorios'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'auriculares-nova-x',
        'Auriculares Nova X',
        'Auriculares inalambricos con cancelacion de ruido activa, 30h de bateria y carga rapida.',
        marca.id,
        categoria.id,
        4.6,
        49,
        'product-images/auriculares-novax.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    data.clave,
    data.nombre,
    data.precio,
    data.stock,
    data.imagen
FROM upsert
CROSS JOIN (VALUES
    ('negro', 'Negro', 49, 12, 'product-images/auriculares-novax.png'),
    ('blanco', 'Blanco', 52, 8, 'product-images/auriculares-novax.png'),
    ('azul', 'Azul', 55, 5, 'product-images/auriculares-novax.png')
) AS data(clave, nombre, precio, stock, imagen)
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH producto_id AS (
    SELECT id FROM productos WHERE slug = 'auriculares-nova-x'
)
INSERT INTO producto_resenas (producto_id, usuario, comentario, rating, fecha_resena)
SELECT
    producto_id.id,
    data.usuario,
    data.comentario,
    data.rating,
    data.fecha_resena
FROM producto_id
CROSS JOIN (VALUES
    ('Ana', 'Se escuchan increible y la bateria dura mucho.', 5, DATE '2025-06-01'),
    ('Luis', 'Muy comodos, el estuche es compacto.', 4, DATE '2025-06-18')
) AS data(usuario, comentario, rating, fecha_resena)
ON CONFLICT (producto_id, usuario, fecha_resena) DO UPDATE
SET comentario = EXCLUDED.comentario,
    rating = EXCLUDED.rating;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Orion'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'CAT 1'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'teclado-orion-k7',
        'Teclado Orion K7',
        'Teclado mecanico compacto con switches hot swap y retroiluminacion RGB.',
        marca.id,
        categoria.id,
        4.3,
        79,
        'product-images/teclado-orion-k7.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    data.clave,
    data.nombre,
    data.precio,
    data.stock,
    data.imagen
FROM upsert
CROSS JOIN (VALUES
    ('red', 'Switch Rojo', 79, 6, 'product-images/teclado-orion-k7.png'),
    ('blue', 'Switch Azul', 79, 9, 'product-images/teclado-orion-k7.png'),
    ('brown', 'Switch Marron', 85, 3, 'product-images/teclado-orion-k7.png')
) AS data(clave, nombre, precio, stock, imagen)
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH producto_id AS (
    SELECT id FROM productos WHERE slug = 'teclado-orion-k7'
)
INSERT INTO producto_resenas (producto_id, usuario, comentario, rating, fecha_resena)
SELECT
    producto_id.id,
    data.usuario,
    data.comentario,
    data.rating,
    data.fecha_resena
FROM producto_id
CROSS JOIN (VALUES
    ('Majo', 'El tamano es perfecto para el escritorio.', 5, DATE '2025-05-02'),
    ('Tomas', 'Buen producto, las keycaps podrian ser mejores.', 3, DATE '2025-07-10')
) AS data(usuario, comentario, rating, fecha_resena)
ON CONFLICT (producto_id, usuario, fecha_resena) DO UPDATE
SET comentario = EXCLUDED.comentario,
    rating = EXCLUDED.rating;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Acme'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'CAT 2'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'mouse-acme-pro',
        'Mouse Acme Pro',
        'Mouse ergonomico de alto rendimiento con sensor 26K y cinco perfiles.',
        marca.id,
        categoria.id,
        4.8,
        39,
        'product-images/mouse-acme.pro.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    data.clave,
    data.nombre,
    data.precio,
    data.stock,
    data.imagen
FROM upsert
CROSS JOIN (VALUES
    ('wired', 'Cableado', 39, 20, 'product-images/mouse-acme.pro.png'),
    ('wireless', 'Inalambrico', 59, 7, 'product-images/mouse-acme.pro.png')
) AS data(clave, nombre, precio, stock, imagen)
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH producto_id AS (
    SELECT id FROM productos WHERE slug = 'mouse-acme-pro'
)
INSERT INTO producto_resenas (producto_id, usuario, comentario, rating, fecha_resena)
SELECT
    producto_id.id,
    data.usuario,
    data.comentario,
    data.rating,
    data.fecha_resena
FROM producto_id
CROSS JOIN (VALUES
    ('Sofia', 'Preciso y muy comodo, ideal para jugar.', 5, DATE '2025-04-14')
) AS data(usuario, comentario, rating, fecha_resena)
ON CONFLICT (producto_id, usuario, fecha_resena) DO UPDATE
SET comentario = EXCLUDED.comentario,
    rating = EXCLUDED.rating;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Zetta'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'CAT 1'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'monitor-zetta-27-qhd',
        'Monitor Zetta 27" QHD',
        'Panel IPS de 27 pulgadas 2560x1440 a 165Hz con FreeSync y soporte ajustable.',
        marca.id,
        categoria.id,
        4.5,
        269,
        'product-images/monitor-zetta.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    data.clave,
    data.nombre,
    data.precio,
    data.stock,
    data.imagen
FROM upsert
CROSS JOIN (VALUES
    ('165', '165 Hz', 269, 4, 'product-images/monitor-zetta.png'),
    ('240', '240 Hz', 339, 2, 'product-images/monitor-zetta.png')
) AS data(clave, nombre, precio, stock, imagen)
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH producto_id AS (
    SELECT id FROM productos WHERE slug = 'monitor-zetta-27-qhd'
)
INSERT INTO producto_resenas (producto_id, usuario, comentario, rating, fecha_resena)
SELECT
    producto_id.id,
    data.usuario,
    data.comentario,
    data.rating,
    data.fecha_resena
FROM producto_id
CROSS JOIN (VALUES
    ('Pablo', 'Colores increibles y fluidez total.', 5, DATE '2025-03-03'),
    ('Vale', 'Buen brillo, los altavoces integrados no destacan.', 4, DATE '2025-06-22')
) AS data(usuario, comentario, rating, fecha_resena)
ON CONFLICT (producto_id, usuario, fecha_resena) DO UPDATE
SET comentario = EXCLUDED.comentario,
    rating = EXCLUDED.rating;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Tempest'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Teclados'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'tempest-k9-nebula-fury-rgb',
        'Tempest K9 Nebula Fury RGB',
        'Teclado gaming con modos RGB, diseno ergonomico y funciones pensadas para sesiones largas.',
        marca.id,
        categoria.id,
        4,
        22,
        'product-images/tempest-k9-nebula-fury.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    22,
    15,
    'product-images/tempest-k9-nebula-fury.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Cougar'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Sillas Gamer'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'cougar-nxsys-aero-silla-gaming',
        'Cougar Nxsys Aero Silla Gaming',
        'Silla gamer con enfoque en ergonomia, refrigeracion y estilo futurista.',
        marca.id,
        categoria.id,
        5,
        296,
        'product-images/cougar-nxsys-aero-silla-gaming-negro-naranja-afd1b24c-7c44-45f4-8a84-bca45e097358.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    296,
    10,
    'product-images/cougar-nxsys-aero-silla-gaming-negro-naranja-afd1b24c-7c44-45f4-8a84-bca45e097358.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Newskill'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Sillas Gamer'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'newskill-neith-zephyr-silla-gaming',
        'Newskill Neith Zephyr Silla Gaming',
        'Silla tapizada en tela transpirable con diseno ergonomico y materiales de alta calidad.',
        marca.id,
        categoria.id,
        4,
        229,
        'product-images/newskill-neith-zephyr-silla-gaming-negra-gris.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    229,
    12,
    'product-images/newskill-neith-zephyr-silla-gaming-negra-gris.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Asus'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Teclados'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'asus-strix-scope-ii-96-wireless',
        'Asus Strix Scope II 96 Wireless Teclado Mecanico',
        'Teclado 96 por ciento con conexion trimodo, switches ROG NX y espuma amortiguadora integrada.',
        marca.id,
        categoria.id,
        5,
        149,
        'product-images/asus-strix-scope-ii-96-wireless-teclado-mecanico-gaming-inalambrico-rgb-switches-rog-nx-snow-storm.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    149,
    18,
    'product-images/asus-strix-scope-ii-96-wireless-teclado-mecanico-gaming-inalambrico-rgb-switches-rog-nx-snow-storm.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Logitech'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Mouse'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'logitech-pro-x-superlight-2',
        'Mouse Logitech Pro X Superlight 2',
        'Mouse ultra ligero de 44000 DPI pensado para competencia y maxima precision.',
        marca.id,
        categoria.id,
        5,
        112,
        'product-images/raton-logitech-pro-x-superlight-2-se-inalambrico-44000-dpi-5-botones-60g-blanco.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    112,
    25,
    'product-images/raton-logitech-pro-x-superlight-2-se-inalambrico-44000-dpi-5-botones-60g-blanco.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Tempest'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Escritorios'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'escritorio-tempest-haven-120x60',
        'Escritorio Gamer Tempest Haven 120x60cm',
        'Mesa gaming con tablero de 18mm y acabado tipo fibra de carbono pensada para setups compactos.',
        marca.id,
        categoria.id,
        3,
        99,
        'product-images/tempest-haven-white-mesa-gaming-120x60cm-rgb-blanca.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    99,
    8,
    'product-images/tempest-haven-white-mesa-gaming-120x60cm-rgb-blanca.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Logitech'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Mouse'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'logitech-mx-master-2s-wireless',
        'Mouse Logitech MX Master 2s Wireless',
        'Mouse premium con Logitech Flow, rueda de velocidad adaptativa y bateria de larga duracion.',
        marca.id,
        categoria.id,
        4,
        77,
        'product-images/logitech-mx-master-2s-raton-wireless-4000-dpi-negro.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    77,
    20,
    'product-images/logitech-mx-master-2s-raton-wireless-4000-dpi-negro.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Kensington'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Trackball'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'kensington-trackball-optico-orbit',
        'Kensington Trackball Optico Orbit',
        'Trackball optico ambidiestro con seguimiento preciso y software TrackballWorks.',
        marca.id,
        categoria.id,
        4,
        35,
        'product-images/kensington-trackball-optico-orbit.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    35,
    30,
    'product-images/kensington-trackball-optico-orbit.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Iggual'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Webcam'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'webcam-iggual-usb-4k-uhd-wc3840',
        'Webcam iggual USB 4K UHD WC3840',
        'Webcam 4K para videollamadas y grabaciones con enfoque automatico y audio claro.',
        marca.id,
        categoria.id,
        5,
        27,
        'product-images/webcam-iggual-usb-4k-uhd-wc3840-business-pro-view-8mp-enfoque-auto-cancelacion-ruido-mejor-precio.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    27,
    40,
    'product-images/webcam-iggual-usb-4k-uhd-wc3840-business-pro-view-8mp-enfoque-auto-cancelacion-ruido-mejor-precio.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'HP'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Mouse'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'hp-410-inalambrico-bluetooth',
        'Mouse HP 410 Inalambrico Bluetooth',
        'Mouse Bluetooth 5 con baja altura, bateria de larga duracion y soporte multisistema.',
        marca.id,
        categoria.id,
        4,
        11,
        'product-images/hp-410-raton-inalambrico-bluetooth-de-perfil-bajo-1200-dpi-blanco-dbb72be0-5575-4709-9e20-aace6bf95e7b.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    11,
    35,
    'product-images/hp-410-raton-inalambrico-bluetooth-de-perfil-bajo-1200-dpi-blanco-dbb72be0-5575-4709-9e20-aace6bf95e7b.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Owlotech'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Teclados'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'owlotech-analog01-wireless',
        'Teclado Owlotech Analog01 Wireless',
        'Teclado con knob que admite modo cableado o inalambrico para mayor versatilidad.',
        marca.id,
        categoria.id,
        3,
        19,
        'product-images/owlotech-analog01-teclado-mecanico-wireless-con-knob.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    19,
    22,
    'product-images/owlotech-analog01-teclado-mecanico-wireless-con-knob.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Epson'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Impresora'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'impresora-epson-et-4956',
        'Impresora Epson Multifuncion ET-4956',
        'Multifuncion EcoTank con tanques recargables, wifi y costos de operacion reducidos.',
        marca.id,
        categoria.id,
        5,
        425,
        'product-images/multifuncion-epson-inkjet-color-et-4956-ecotank-wifi-lcd-fax-duplex-todo-en-uno.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    425,
    6,
    'product-images/multifuncion-epson-inkjet-color-et-4956-ecotank-wifi-lcd-fax-duplex-todo-en-uno.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Herman Miller'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Sillas Oficina'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'silla-herman-miller-aeron',
        'Silla Oficina Herman Miller Aeron',
        'Silla iconica actualizada con plasticos reciclados y soporte de alto desempeño.',
        marca.id,
        categoria.id,
        5,
        1930,
        'product-images/herman-miller-aeron.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    1930,
    5,
    'product-images/herman-miller-aeron.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Neumann'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Monitores Estudio'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'neumann-kh310-arg',
        'Monitor Activo Neumann KH310 ARG',
        'Monitor de estudio de 3 vias con DSP integrado y respuesta desde 34 Hz.',
        marca.id,
        categoria.id,
        5,
        2238,
        'product-images/monitor-neumann-KH310ARG_1.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    2238,
    4,
    'product-images/monitor-neumann-KH310ARG_1.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Yamaha'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Monitores Estudio'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'yamaha-hs3w-blanco',
        'Monitor Yamaha HS3W Blanco 3.5 (Par)',
        'Par de monitores compactos clase D con diseno bass reflex y respuesta de 70 a 22kHz.',
        marca.id,
        categoria.id,
        4,
        259,
        'product-images/monitor-yamaha-HS3W.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    259,
    9,
    'product-images/monitor-yamaha-HS3W.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;

WITH marca AS (
    SELECT id FROM marcas WHERE nombre = 'Audeze'
),
categoria AS (
    SELECT id FROM categorias WHERE nombre = 'Audifonos Estudio'
),
upsert AS (
    INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
    SELECT
        'audeze-lcd-2-rosewood',
        'Audifonos Audeze LCD-2 Rosewood',
        'Audifonos magneticos planares con timbre calido y construccion premium en madera.',
        marca.id,
        categoria.id,
        5,
        1399,
        'product-images/audifonos-estudio-audezeLCD2.png'
    FROM marca, categoria
    ON CONFLICT (slug) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        id_marca = EXCLUDED.id_marca,
        id_categoria = EXCLUDED.id_categoria,
        rating = EXCLUDED.rating,
        precio_base = EXCLUDED.precio_base,
        imagen_principal = EXCLUDED.imagen_principal
    RETURNING id
)
INSERT INTO producto_variantes (producto_id, clave, nombre, precio, stock, imagen)
SELECT
    upsert.id,
    'base',
    'Version base',
    1399,
    7,
    'product-images/audifonos-estudio-audezeLCD2.png'
FROM upsert
ON CONFLICT (producto_id, clave) DO UPDATE
SET nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    imagen = EXCLUDED.imagen;


import express from "express";
import db from "../db.js";

const router = express.Router();

function sendJson(res, payload, status = 200) {
    res
        .status(status)
        .type("application/json; charset=utf-8")
        .send(JSON.stringify(payload));
}

function slugify(value = "") {
    return value
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function buildMediaUrl(req, relativePath) {
    if (!relativePath) return null;
    if (/^https?:\/\//i.test(relativePath)) return relativePath;
    const clean = relativePath.replace(/^\/+/, "");
    const host = req.get("host");
    if (!host) return null;
    if (clean.startsWith("media/")) {
        return `${req.protocol}://${host}/${clean}`;
    }
    return `${req.protocol}://${host}/media/${clean}`;
}

function mapProducts(req, productos, variantes, resenas) {
    const variantesPorProducto = new Map();
    variantes.forEach((v) => {
        const lista = variantesPorProducto.get(v.producto_id) || [];
        lista.push({
            id: v.clave,
            name: v.nombre,
            price: Number(v.precio),
            stock: v.stock,
            image: buildMediaUrl(req, v.imagen),
        });
        variantesPorProducto.set(v.producto_id, lista);
    });
    variantesPorProducto.forEach((lista) => lista.sort((a, b) => a.price - b.price));

    const resenasPorProducto = new Map();
    resenas.forEach((r) => {
        const lista = resenasPorProducto.get(r.producto_id) || [];
        lista.push({
            id: r.id,
            user: r.usuario,
            rating: r.rating,
            comment: r.comentario,
            date: r.fecha_resena ? new Date(r.fecha_resena).toISOString().split("T")[0] : null,
        });
        resenasPorProducto.set(r.producto_id, lista);
    });

    return productos.map((p) => {
        const variants = variantesPorProducto.get(p.id) || [];
        const reviews = resenasPorProducto.get(p.id) || [];
        const rating = reviews.length
            ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
            : Number(p.rating || 0);
        const image = buildMediaUrl(req, p.imagen_principal) || variants[0]?.image || null;
        const price = variants.length ? variants[0].price : Number(p.precio_base);

        return {
            id: p.id,
            slug: p.slug,
            name: p.nombre,
            description: p.descripcion,
            brand: p.marca,
            category: p.categoria,
            rating,
            price,
            image,
            variants,
            reviews,
        };
    });
}

async function fetchProductos(req, whereClause = "", params = []) {
    const query = `
        SELECT
            p.id,
            p.slug,
            p.nombre,
            p.descripcion,
            p.rating,
            p.precio_base,
            p.imagen_principal,
            m.nombre AS marca,
            c.nombre AS categoria
        FROM productos p
        JOIN marcas m ON m.id = p.id_marca
        JOIN categorias c ON c.id = p.id_categoria
        ${whereClause}
        ORDER BY p.id
    `;
    const { rows: productos } = await db.query(query, params);
    if (!productos.length) return [];
    const ids = productos.map((p) => p.id);

    const { rows: variantes } = await db.query(
        `
            SELECT id, producto_id, clave, nombre, precio, stock, imagen
            FROM producto_variantes
            WHERE producto_id = ANY($1)
            ORDER BY precio ASC, id ASC
        `,
        [ids]
    );

    const { rows: resenas } = await db.query(
        `
            SELECT id, producto_id, usuario, comentario, rating, fecha_resena
            FROM producto_resenas
            WHERE producto_id = ANY($1)
            ORDER BY fecha_resena DESC, id DESC
        `,
        [ids]
    );

    return mapProducts(req, productos, variantes, resenas);
}

router.get("/", async (req, res) => {
    try {
        const productos = await fetchProductos(req);
        sendJson(res, productos);
    } catch (error) {
        console.error(error);
        sendJson(res, { error: "No se pudieron obtener los productos" }, 500);
    }
});

router.get("/:id", async (req, res) => {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
        return sendJson(res, { error: "Identificador invalido" }, 400);
    }
    try {
        const productos = await fetchProductos(req, "WHERE p.id = $1", [productId]);
        if (!productos.length) return sendJson(res, { error: "Producto no encontrado" }, 404);
        sendJson(res, productos[0]);
    } catch (error) {
        console.error(error);
        sendJson(res, { error: "No se pudo obtener el producto" }, 500);
    }
});

router.post("/", async (req, res) => {
    const { nombre, descripcion, id_marca, id_categoria, precio_base, rating = 0, imagen_principal = null, slug } = req.body;
    if (!nombre || !id_marca || !id_categoria || !precio_base) {
        return sendJson(res, { error: "Faltan datos obligatorios" }, 400);
    }
    const generatedSlug = (slug?.trim() || slugify(nombre) || `producto-${Date.now()}`);
    try {
        const { rows } = await db.query(
            `
                INSERT INTO productos (slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id, slug, nombre, descripcion, id_marca, id_categoria, rating, precio_base, imagen_principal
            `,
            [generatedSlug, nombre, descripcion || "", id_marca, id_categoria, rating, precio_base, imagen_principal]
        );
        sendJson(res, rows[0], 201);
    } catch (error) {
        console.error(error);
        sendJson(res, { error: "No se pudo crear el producto" }, 500);
    }
});

export default router;

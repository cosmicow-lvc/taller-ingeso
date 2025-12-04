import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener (o crear) carrito por usuario
router.get("/:usuarioId", async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  if (isNaN(usuarioId)) return res.status(400).json({ error: "usuarioId inválido" });

  try {
    // buscar carrito
    let result = await db.query("SELECT * FROM carts WHERE usuario_id = $1", [usuarioId]);
    let cart;
    if (result.rows.length === 0) {
      // crear carrito vacío
      result = await db.query("INSERT INTO carts (usuario_id) VALUES ($1) RETURNING *", [usuarioId]);
      cart = result.rows[0];
    } else {
      cart = result.rows[0];
    }

    // obtener items
    const itemsRes = await db.query(
      "SELECT ci.id, ci.producto_id, ci.cantidad, ci.precio_unitario, ci.fecha_agregado FROM cart_items ci WHERE ci.cart_id = $1",
      [cart.id]
    );

    res.json({ cart, items: itemsRes.rows });
  } catch (err) {
    console.error("Error obteniendo carrito:", err);
    res.status(500).json({ error: err.message });
  }
});

// Agregar item al carrito (o incrementar cantidad si ya existe)
router.post("/:usuarioId/items", async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const { producto_id, cantidad = 1, precio_unitario = null } = req.body;
  if (isNaN(usuarioId) || !producto_id) return res.status(400).json({ error: "Datos inválidos" });

  try {
    // obtener o crear carrito
    let result = await db.query("SELECT * FROM carts WHERE usuario_id = $1", [usuarioId]);
    let cart;
    if (result.rows.length === 0) {
      result = await db.query("INSERT INTO carts (usuario_id) VALUES ($1) RETURNING *", [usuarioId]);
      cart = result.rows[0];
    } else {
      cart = result.rows[0];
    }

    // verificar si existe item con mismo producto_id
    const existing = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND producto_id = $2",
      [cart.id, producto_id]
    );

    if (existing.rows.length > 0) {
      const newQty = existing.rows[0].cantidad + cantidad;
      const upd = await db.query(
        "UPDATE cart_items SET cantidad = $1, precio_unitario = COALESCE($2, precio_unitario) WHERE id = $3 RETURNING *",
        [newQty, precio_unitario, existing.rows[0].id]
      );
      return res.json({ item: upd.rows[0] });
    }

    const insert = await db.query(
      "INSERT INTO cart_items (cart_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *",
      [cart.id, producto_id, cantidad, precio_unitario]
    );

    res.status(201).json({ item: insert.rows[0] });
  } catch (err) {
    console.error("Error agregando item al carrito:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar cantidad de un item
router.patch("/:usuarioId/items/:itemId", async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const itemId = parseInt(req.params.itemId, 10);
  const { cantidad } = req.body;
  if (isNaN(usuarioId) || isNaN(itemId) || typeof cantidad !== "number") return res.status(400).json({ error: "Datos inválidos" });

  try {
    // asegurar que el item pertenezca al carrito del usuario
    const itemRes = await db.query(
      `SELECT ci.* FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE ci.id = $1 AND c.usuario_id = $2`,
      [itemId, usuarioId]
    );
    if (itemRes.rows.length === 0) return res.status(404).json({ error: "Item no encontrado" });

    if (cantidad <= 0) {
      // eliminar item si la cantidad es 0 o negativa
      await db.query("DELETE FROM cart_items WHERE id = $1", [itemId]);
      return res.json({ message: "Item eliminado" });
    }

    const upd = await db.query("UPDATE cart_items SET cantidad = $1 WHERE id = $2 RETURNING *", [cantidad, itemId]);
    res.json({ item: upd.rows[0] });
  } catch (err) {
    console.error("Error actualizando item:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar item
router.delete("/:usuarioId/items/:itemId", async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const itemId = parseInt(req.params.itemId, 10);
  if (isNaN(usuarioId) || isNaN(itemId)) return res.status(400).json({ error: "Datos inválidos" });

  try {
    const del = await db.query(
      `DELETE FROM cart_items ci USING carts c WHERE ci.id = $1 AND ci.cart_id = c.id AND c.usuario_id = $2 RETURNING ci.*`,
      [itemId, usuarioId]
    );
    if (del.rows.length === 0) return res.status(404).json({ error: "Item no encontrado" });
    res.json({ message: "Item eliminado" });
  } catch (err) {
    console.error("Error eliminando item:", err);
    res.status(500).json({ error: err.message });
  }
});

// Vaciar carrito
router.delete("/:usuarioId", async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  if (isNaN(usuarioId)) return res.status(400).json({ error: "usuarioId inválido" });

  try {
    // obtener carrito
    const cartRes = await db.query("SELECT * FROM carts WHERE usuario_id = $1", [usuarioId]);
    if (cartRes.rows.length === 0) return res.json({ message: "Carrito vacío" });
    const cart = cartRes.rows[0];
    await db.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);
    res.json({ message: "Carrito vaciado" });
  } catch (err) {
    console.error("Error vaciando carrito:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

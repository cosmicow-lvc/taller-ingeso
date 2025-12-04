import express from 'express';
import pool from '../db.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Crear una compra (POST /compras)
router.post('/', verifyToken, async (req, res) => {
  try {
    const usuario_id = req.usuario_id;
    console.log("POST /compras - usuario_id:", usuario_id, "tipo:", typeof usuario_id);
    
    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const { 
      nombre_completo, 
      email, 
      telefono, 
      direccion, 
      ciudad, 
      codigo_postal, 
      items, 
      monto_total 
    } = req.body;

    console.log("Body recibido:", JSON.stringify(req.body, null, 2));
    console.log("Items recibidos:", items);
    if (items && items.length > 0) {
      console.log("Primer item:", JSON.stringify(items[0], null, 2));
    }

    // Validaciones básicas
    if (!nombre_completo || !email || !direccion || !ciudad || !codigo_postal || !items || items.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Iniciar transacción
    const client = await pool.connect();
    try {
      console.log("Iniciando transacción para usuario:", usuario_id);
      console.log("Datos de compra:", { nombre_completo, email, telefono, direccion, ciudad, codigo_postal, monto_total });
      await client.query('BEGIN');

      // Insertar compra
      const params = [usuario_id, nombre_completo, email, telefono || null, direccion, ciudad, codigo_postal, parseFloat(monto_total)];
      console.log("Parámetros SQL:", params);
      
      const compraResult = await client.query(
        `INSERT INTO compras (usuario_id, nombre_completo, email, telefono, direccion, ciudad, codigo_postal, monto_total)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, fecha_compra`,
        params
      );

      const compra_id = compraResult.rows[0].id;
      console.log("Compra insertada con ID:", compra_id);

      // Insertar líneas de compra
      for (const item of items) {
        console.log("Item actual:", JSON.stringify(item));
        const price = parseFloat(item.price);
        const qty = parseInt(item.qty);
        
        if (isNaN(price) || isNaN(qty)) {
          console.error("Error en conversión de tipos:", { item, price, qty });
          throw new Error(`Datos inválidos en item: price=${price}, qty=${qty}`);
        }
        
        const subtotal = price * qty;
        const lineParams = [
          compra_id,
          item.productId ? parseInt(item.productId) : null,
          item.variantId ? String(item.variantId) : null,  // variantId puede ser string o número, guardar como string
          String(item.name || 'Producto sin nombre'),
          item.brand ? String(item.brand) : null,
          item.category ? String(item.category) : null,
          price,
          qty,
          subtotal,
          item.meta?.image ? String(item.meta.image) : null
        ];
        console.log("Parámetros línea lista:", lineParams);
        await client.query(
          `INSERT INTO compra_lineas (compra_id, producto_id, variante_id, nombre_producto, marca, categoria, precio_unitario, cantidad, subtotal, imagen)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          lineParams
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        compra_id,
        mensaje: 'Compra registrada exitosamente',
        fecha_compra: compraResult.rows[0].fecha_compra
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error en transacción:', err.message);
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al crear compra:', error.message);
    res.status(500).json({ error: 'Error al registrar la compra: ' + error.message });
  }
});

// Obtener compras del usuario autenticado (GET /compras)
router.get('/', verifyToken, async (req, res) => {
  try {
    const usuario_id = req.usuario_id;
    console.log("GET /compras - usuario_id:", usuario_id);

    const result = await pool.query(
      `SELECT 
        c.id,
        c.estado,
        c.monto_total,
        c.nombre_completo,
        c.email,
        c.telefono,
        c.direccion,
        c.ciudad,
        c.codigo_postal,
        c.fecha_compra,
        c.fecha_entrega,
        json_agg(
          json_build_object(
            'id', cl.id,
            'nombre_producto', cl.nombre_producto,
            'marca', cl.marca,
            'categoria', cl.categoria,
            'precio_unitario', cl.precio_unitario,
            'cantidad', cl.cantidad,
            'subtotal', cl.subtotal,
            'imagen', cl.imagen
          )
        ) as lineas
      FROM compras c
      LEFT JOIN compra_lineas cl ON c.id = cl.compra_id
      WHERE c.usuario_id = $1
      GROUP BY c.id
      ORDER BY c.fecha_compra DESC`,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
});

// Obtener detalle de una compra específica (GET /compras/:id)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const usuario_id = req.usuario_id;
    const compra_id = req.params.id;

    const result = await pool.query(
      `SELECT 
        c.id,
        c.estado,
        c.monto_total,
        c.nombre_completo,
        c.email,
        c.telefono,
        c.direccion,
        c.ciudad,
        c.codigo_postal,
        c.fecha_compra,
        c.fecha_entrega,
        json_agg(
          json_build_object(
            'id', cl.id,
            'nombre_producto', cl.nombre_producto,
            'marca', cl.marca,
            'categoria', cl.categoria,
            'precio_unitario', cl.precio_unitario,
            'cantidad', cl.cantidad,
            'subtotal', cl.subtotal,
            'imagen', cl.imagen
          )
        ) as lineas
      FROM compras c
      LEFT JOIN compra_lineas cl ON c.id = cl.compra_id
      WHERE c.id = $1 AND c.usuario_id = $2
      GROUP BY c.id`,
      [compra_id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({ error: 'Error al obtener la compra' });
  }
});

export default router;

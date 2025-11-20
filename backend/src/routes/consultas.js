import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /consultas → obtener todas las consultas (para administradores)
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM consultas ORDER BY fecha_creacion DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener consultas:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /consultas/:id → obtener una consulta específica
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            "SELECT * FROM consultas WHERE id = $1",
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Consulta no encontrada" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error al obtener consulta:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST /consultas → crear nueva consulta
router.post("/", async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;
        
        // Validación básica
        if (!nombre || !email || !asunto || !mensaje) {
            return res.status(400).json({ 
                error: "Todos los campos son requeridos" 
            });
        }
        
        const result = await db.query(
            `INSERT INTO consultas (nombre, email, asunto, mensaje, fecha_creacion, respondida) 
             VALUES ($1, $2, $3, $4, NOW(), false) 
             RETURNING *`,
            [nombre, email, asunto, mensaje]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error al crear consulta:", err);
        res.status(500).json({ error: err.message });
    }
});

// PATCH /consultas/:id/responder → marcar consulta como respondida y agregar respuesta
router.patch("/:id/responder", async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta } = req.body;
        
        if (!respuesta) {
            return res.status(400).json({ 
                error: "La respuesta es requerida" 
            });
        }
        
        const result = await db.query(
            `UPDATE consultas 
             SET respondida = true, 
                 respuesta = $1, 
                 fecha_respuesta = NOW() 
             WHERE id = $2 
             RETURNING *`,
            [respuesta, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Consulta no encontrada" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error al responder consulta:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /consultas/:id → eliminar una consulta
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            "DELETE FROM consultas WHERE id = $1 RETURNING *",
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Consulta no encontrada" });
        }
        
        res.json({ message: "Consulta eliminada exitosamente" });
    } catch (err) {
        console.error("Error al eliminar consulta:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

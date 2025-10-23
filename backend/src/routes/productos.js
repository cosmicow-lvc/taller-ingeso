import express from "express";
import db from "../db.js"; // import your database connection

const router = express.Router();

// GET /productos → get all productos
router.get("/", (req, res) => {
    db.query("SELECT * FROM producto", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST /productos → add a new productos
router.post("/", (req, res) => {
    const { nombre, descripcion, id_marca, precio_base } = req.body;
    db.query(
        "INSERT INTO producto (nombre, descripcion, id_marca, precio_base) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, id_marca, precio_base],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, nombre, descripcion, id_marca, precio_base });
        }
    );
});

export default router;

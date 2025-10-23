import express from "express";
import db from "../db.js"; // import your database connection

const router = express.Router();

// GET /clientes → get all clientes
router.get("/", (req, res) => {
    db.query("SELECT * FROM cliente", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST /clientes → add a new cliente
router.post("/", (req, res) => {
    const { es_registrado, correo, nombre_usuario, password_hash, telefono } = req.body;
    db.query(
        "INSERT INTO cliente (es_registrado, correo, nombre_usuario, password_hash, telefono) VALUES (?, ?, ?, ?, ?, ?)",
        [es_registrado, correo, nombre_usuario, password_hash, telefono],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, es_registrado, correo, nombre_usuario, password_hash, telefono });
        }
    );
});

//fetch("http://localhost:3000/clientes", {
//    method: "POST",
//    headers: { "Content-Type": "application/json" },
//    body: JSON.stringify({ 
//        es_registrado: TRUE, 
//        correo: "juan@ejemplo.com",  
//        nombre_usuario: "juan",
//        password_hash: "asd",
//        telefono: "+56912345678"
//    })
//})
//.then(r => r.json())
//.then(console.log)
//.catch(console.error);

export default router;

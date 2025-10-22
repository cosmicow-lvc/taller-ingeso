import express from "express";
import db from "../db.js"; // import your database connection

const router = express.Router();

// GET /users → get all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST /users → add a new user
router.post("/", (req, res) => {
    const { name, price } = req.body;
    db.query(
        "INSERT INTO products (name, price) VALUES (?, ?)",
        [name, price],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, name, price });
        }
    );
});

export default router;

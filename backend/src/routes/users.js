import express from "express";
import db from "../db.js"; // import your database connection

const router = express.Router();

// GET /users → get all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST /users → add a new user
router.post("/", (req, res) => {
    const { name, email } = req.body;
    db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, name, email });
        }
    );
});

export default router;

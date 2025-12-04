import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = express.Router();

// Middleware para verificar token JWT
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Para propósitos de demostración, simplemente decodificamos el token
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      console.log("Token decodificado:", decoded, "tipo:", typeof decoded.usuario_id);
      if (!decoded.usuario_id) {
        return res.status(401).json({ error: "Token sin usuario_id" });
      }
      const usuarioId = Number(decoded.usuario_id);
      console.log("Usuario ID convertido:", usuarioId, "tipo:", typeof usuarioId);
      req.usuario_id = usuarioId;
      next();
    } catch (err) {
      console.error("Token decode error:", err.message);
      return res.status(401).json({ error: "Token inválido" });
    }
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return res.status(401).json({ error: "Error al verificar token" });
  }
}

// POST /auth/registro → Registrar nuevo usuario
router.post("/registro", async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        
        // Validación básica
        if (!nombre || !email || !password) {
            return res.status(400).json({ 
                error: "Nombre, email y contraseña son requeridos" 
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: "El formato del email no es válido" 
            });
        }

        // Validar longitud de contraseña
        if (password.length < 8) {
            return res.status(400).json({ 
                error: "La contraseña debe tener al menos 8 caracteres" 
            });
        }

        // Verificar si el email ya existe
        const checkEmail = await db.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [email]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(409).json({ 
                error: "El email ya está registrado" 
            });
        }

        // Encriptar contraseña
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insertar usuario
        const result = await db.query(
            `INSERT INTO usuarios (nombre, apellido, email, password_hash, fecha_registro, activo) 
             VALUES ($1, $2, $3, $4, NOW(), true) 
             RETURNING id, nombre, apellido, email, fecha_registro`,
            [nombre, apellido || null, email, password_hash]
        );

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: result.rows[0]
        });

    } catch (err) {
        console.error("Error en registro:", err);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
});

// POST /auth/login → Iniciar sesión
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación básica
        if (!email || !password) {
            return res.status(400).json({ 
                error: "Email y contraseña son requeridos" 
            });
        }

        // Buscar usuario por email
        const result = await db.query(
            "SELECT id, nombre, apellido, email, password_hash, activo FROM usuarios WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: "Credenciales inválidas" 
            });
        }

        const usuario = result.rows[0];

        // Verificar si la cuenta está activa
        if (!usuario.activo) {
            return res.status(403).json({ 
                error: "La cuenta está desactivada" 
            });
        }

        // Comparar contraseñas
        const passwordMatch = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ 
                error: "Credenciales inválidas" 
            });
        }

        // Login exitoso - eliminar password_hash de la respuesta
        delete usuario.password_hash;

        // Generar token (base64 encoded JSON con usuario_id)
        const token = Buffer.from(JSON.stringify({ usuario_id: usuario.id })).toString('base64');

        res.json({
            message: "Login exitoso",
            token,
            usuario
        });

    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

// GET /auth/usuario/:id → Obtener información de usuario (opcional, para perfil)
router.get("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "SELECT id, nombre, apellido, email, fecha_registro, activo FROM usuarios WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error("Error al obtener usuario:", err);
        res.status(500).json({ error: "Error al obtener información del usuario" });
    }
});

// PUT /auth/usuario/:id → Actualizar información de usuario
router.put("/usuario/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, passwordActual, passwordNueva } = req.body;

        // Validación básica
        if (!nombre || !email) {
            return res.status(400).json({ 
                error: "Nombre y email son requeridos" 
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: "El formato del email no es válido" 
            });
        }

        // Verificar si el usuario existe
        const usuarioExistente = await db.query(
            "SELECT id, email, password_hash FROM usuarios WHERE id = $1",
            [id]
        );

        if (usuarioExistente.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Si el email cambió, verificar que no esté en uso
        if (email !== usuarioExistente.rows[0].email) {
            const emailEnUso = await db.query(
                "SELECT id FROM usuarios WHERE email = $1 AND id != $2",
                [email, id]
            );

            if (emailEnUso.rows.length > 0) {
                return res.status(409).json({ 
                    error: "El email ya está en uso por otro usuario" 
                });
            }
        }

        let updateQuery = "";
        let updateParams = [];

        // Si se quiere cambiar la contraseña
        if (passwordNueva) {
            // Validar longitud de la nueva contraseña
            if (passwordNueva.length < 8) {
                return res.status(400).json({ 
                    error: "La nueva contraseña debe tener al menos 8 caracteres" 
                });
            }

            // Verificar contraseña actual
            if (!passwordActual) {
                return res.status(400).json({ 
                    error: "Debes proporcionar la contraseña actual para cambiarla" 
                });
            }

            const passwordMatch = await bcrypt.compare(
                passwordActual, 
                usuarioExistente.rows[0].password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({ 
                    error: "La contraseña actual es incorrecta" 
                });
            }

            // Encriptar nueva contraseña
            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(passwordNueva, saltRounds);

            updateQuery = `
                UPDATE usuarios 
                SET nombre = $1, apellido = $2, email = $3, password_hash = $4
                WHERE id = $5
                RETURNING id, nombre, apellido, email, fecha_registro, activo
            `;
            updateParams = [nombre, apellido || null, email, newPasswordHash, id];
        } else {
            // Solo actualizar datos sin cambiar contraseña
            updateQuery = `
                UPDATE usuarios 
                SET nombre = $1, apellido = $2, email = $3
                WHERE id = $4
                RETURNING id, nombre, apellido, email, fecha_registro, activo
            `;
            updateParams = [nombre, apellido || null, email, id];
        }

        const result = await db.query(updateQuery, updateParams);

        res.json({
            message: "Usuario actualizado exitosamente",
            usuario: result.rows[0]
        });

    } catch (err) {
        console.error("Error al actualizar usuario:", err);
        res.status(500).json({ error: "Error al actualizar información del usuario" });
    }
});

export default router;

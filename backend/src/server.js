import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import clientesRouter from "./routes/clientes.js";
import productosRouter from "./routes/productos.js";
import consultasRouter from "./routes/consultas.js";
import authRouter from "./routes/auth.js";
import comprasRouter from "./routes/compras.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/media", express.static(path.join(__dirname, "../public")));

app.use("/clientes", clientesRouter);
app.use("/productos", productosRouter);
app.use("/consultas", consultasRouter);
app.use("/auth", authRouter);
app.use("/compras", comprasRouter);

app.listen(3000, () => console.log("Server running on port 3000"));

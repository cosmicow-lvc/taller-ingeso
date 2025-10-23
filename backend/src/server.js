import express from "express";
import cors from "cors";
import clientesRouter from "./routes/clientes.js";
import productosRouter from "./routes/productos.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/clientes", clientesRouter);
app.use("/productos", productosRouter);

app.listen(3000, () => console.log("Server running on port 3000"));

import express from "express";
import cors from "cors";
import clientesRouter from "./routes/clientes.js";
import productosRouter from "./routes/productos.js";
import consultasRouter from "./routes/consultas.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/clientes", clientesRouter);
app.use("/productos", productosRouter);
app.use("/consultas", consultasRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);

app.listen(3000, () => console.log("Server running on port 3000"));

import express from "express";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";

const app = express();
app.use(express.json());

app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(3000, () => console.log("Server running on port 3000"));

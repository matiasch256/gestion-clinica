import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import proveedoresRoutes from "./routes/proveedores.js";
import comprasRoutes from "./routes/compras.js";
import productosRoutes from "./routes/productos.js";
import categoriasRoutes from "./routes/categorias.js";
import usuariosRoutes from "./routes/usuarios.js";
import gastosRoutes from "./routes/gastos.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/proveedores", proveedoresRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/gastos", gastosRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

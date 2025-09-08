import "./src/config/env.js";
import { validateEnvVars } from "./src/config/validateEnv.js";
validateEnvVars();
import express from "express";
import cors from "cors";
import proveedoresRoutes from "./src/routes/proveedores.js";
import comprasRoutes from "./src/routes/compras.js";
import productosRoutes from "./src/routes/productos.js";
import categoriasRoutes from "./src/routes/categorias.js";
import usuariosRoutes from "./src/routes/usuarios.js";
import gastosRoutes from "./src/routes/gastos.js";
import dashboardRoutes from "./src/routes/dashboard.js";
import authRoutes from "./src/routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/proveedores", proveedoresRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/gastos", gastosRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

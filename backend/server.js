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
import turnosRoutes from "./src/routes/turnos.js";
import pacientesRoutes from "./src/routes/pacientes.js";
import profesionalesRoutes from "./src/routes/profesionales.js";
import { iniciarTareaRecordatorios } from "./src/services/reminderService.js";
import facturacionRoutes from "./src/routes/facturacion.js";
import serviciosRoutes from "./src/routes/servicios.js";
import metodosPagoRoutes from "./src/routes/metodosPago.js";
import obrasSocialesRoutes from "./src/routes/obrasSociales.js";
import reportesRoutes from "./src/routes/reportes.js";
import especialidadesRoutes from "./src/routes/especialidades.js";

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
app.use("/api/turnos", turnosRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/profesionales", profesionalesRoutes);
app.use("/api/facturacion", facturacionRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/metodos-pago", metodosPagoRoutes);
app.use("/api/obras-sociales", obrasSocialesRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/especialidades", especialidadesRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
  iniciarTareaRecordatorios();
});

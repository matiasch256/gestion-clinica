import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT * FROM proveedores");
    res.json(result.recordset);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).send("Error en el servidor");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.query`SELECT * FROM proveedores WHERE id = ${id}`;
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Proveedor no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al consultar proveedor:", err.message);
    res
      .status(500)
      .json({ error: `Error al consultar proveedor: ${err.message}` });
  }
});

router.post("/", async (req, res) => {
  const { nombre, direccion, barrio, telefono } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.query`
      INSERT INTO proveedores (nombre, direccion, barrio, telefono)
      VALUES (${nombre?.trim()}, ${direccion?.trim()}, ${barrio?.trim()}, ${telefono?.trim()})
    `;
    res.status(200).json({ message: "Proveedor registrado", result });
  } catch (err) {
    console.error("❌ Error al insertar proveedor:", err);
    res.status(500).json({ error: "Error al registrar proveedor" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Eliminando proveedor con ID: ${id}`);
  try {
    const pool = await getPool();
    const result = await pool.query`DELETE FROM proveedores WHERE id = ${id}`;
    console.log(`Resultado de la eliminación:`, result);
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Proveedor eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Proveedor no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al eliminar proveedor:", err);
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, barrio, telefono } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.query`
      UPDATE proveedores
      SET nombre = ${nombre?.trim()}, direccion = ${direccion?.trim()}, barrio = ${barrio?.trim()}, telefono = ${telefono?.trim()}
      WHERE id = ${id}
    `;
    res.status(200).json({ message: "Proveedor actualizado", result });
  } catch (err) {
    console.error("❌ Error al actualizar proveedor:", err);
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
});

export default router;

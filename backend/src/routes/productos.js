import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query`SELECT * FROM productos`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.query`SELECT * FROM productos WHERE id = ${id}`;
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

router.post("/", async (req, res) => {
  const { nombre, descripcion, unidadMedida, stock, stockMinimo } = req.body;
  try {
    const pool = await getPool();
    await pool.query`
      INSERT INTO productos (nombre, descripcion, unidadMedida, stock, stockMinimo)
      VALUES (${nombre}, ${descripcion}, ${unidadMedida}, ${stock}, ${stockMinimo})
    `;
    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    codigo,
    unidadMedida,
    stock,
    stockMinimo,
    observaciones,
    activo,
  } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.query`
      UPDATE productos
      SET nombre = ${nombre}, descripcion = ${descripcion}, codigo = ${codigo},
          unidadMedida = ${unidadMedida}, stock = ${stock}, stockMinimo = ${stockMinimo},
          observaciones = ${observaciones}, activo = ${activo}
      WHERE id = ${id}
    `;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Producto actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.query`DELETE FROM productos WHERE id = ${id}`;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;

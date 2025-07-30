import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query`SELECT * FROM categorias`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.query`SELECT * FROM categorias WHERE id = ${id}`;
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("❌ Error al obtener categoría:", error);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
});

router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const pool = await getPool();
    await pool.query`INSERT INTO categorias (nombre, descripcion) VALUES (${nombre}, ${descripcion})`;
    res.status(201).json({ message: "Categoría creada correctamente" });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const pool = await getPool();
    const result = await pool.query`
      UPDATE categorias
      SET nombre = ${nombre}, descripcion = ${descripcion}
      WHERE id = ${id}
    `;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Categoría actualizada correctamente" });
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.query`DELETE FROM categorias WHERE id = ${id}`;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Categoría eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

export default router;

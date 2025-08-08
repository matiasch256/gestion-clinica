import express from "express";
import { getPool } from "../config/database.js";
import mssql from "mssql";

const router = express.Router();

const validateInput = (id, body, res) => {
  if (id && (isNaN(parseInt(id)) || !id)) {
    res.status(400).json({ error: "ID inválido" });
    return false;
  }
  if (body) {
    const { nombre, descripcion, ...rest } = body;
    if (Object.keys(rest).length > 0) {
      res.status(400).json({ error: "Campos no permitidos" });
      return false;
    }
    if (!nombre?.trim() || !descripcion?.trim()) {
      res.status(400).json({ error: "Nombre y descripción son requeridos" });
      return false;
    }
  }
  return true;
};

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
  if (!validateInput(id, null, res)) return;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", mssql.Int, parseInt(id));
    const result = await request.query`SELECT * FROM categorias WHERE id = @id`;
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
  const { nombre, descripcion, ...rest } = req.body;
  if (!validateInput(null, req.body, res)) return;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("nombre", mssql.VarChar, nombre.trim());
    request.input("descripcion", mssql.VarChar, descripcion.trim());
    await request.query`INSERT INTO categorias (nombre, descripcion) VALUES (@nombre, @descripcion)`;
    res.status(201).json({ message: "Categoría creada correctamente" });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  if (!validateInput(id, req.body, res)) return;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", mssql.Int, parseInt(id));
    request.input("nombre", mssql.VarChar, nombre.trim());
    request.input("descripcion", mssql.VarChar, descripcion.trim());
    const result = await request.query`
      UPDATE categorias
      SET nombre = @nombre, descripcion = @descripcion
      WHERE id = @id
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
  if (!validateInput(id, null, res)) return;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("id", mssql.Int, parseInt(id));
    const result = await request.query`DELETE FROM categorias WHERE id = @id`;
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

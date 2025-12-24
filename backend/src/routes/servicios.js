import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query(
      "SELECT ID_Servicio, Nombre, CostoBase FROM Servicios"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los servicios:", err);
    res
      .status(500)
      .json({ error: "Error al obtener los servicios", details: err.message });
  }
});

export default router;

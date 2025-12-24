import express from "express";
import { getPool } from "../config/database.js";
import sql from "mssql";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(
        "SELECT ID_Especialidad, Nombre FROM Especialidades ORDER BY Nombre"
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener especialidades:", err);
    res.status(500).json({ error: "Error al obtener especialidades" });
  }
});

export default router;

import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT 
        M.ID_Medico, 
        M.Nombre, 
        M.Apellido, 
        E.Nombre AS Especialidad 
      FROM Medicos M
      LEFT JOIN Especialidades E ON M.ID_Especialidad = E.ID_Especialidad
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener médicos:", err);
    res.status(500).json({ error: "Error al obtener médicos" });
  }
});

export default router;

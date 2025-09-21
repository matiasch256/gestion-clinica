import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT ID_Paciente, Nombre, Apellido
      FROM Pacientes
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener pacientes:", err);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

router.get("/search", async (req, res) => {
  const term = req.query.term || "";
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("searchTerm", `%${term}%`);

    const result = await request.query(`
      SELECT ID_Paciente, Nombre, Apellido, Telefono, ObraSocial, DNI
      FROM Pacientes 
      WHERE Nombre LIKE @searchTerm OR Apellido LIKE @searchTerm OR Telefono LIKE @searchTerm OR DNI LIKE @searchTerm
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al buscar pacientes:", err);
    res.status(500).json([]);
  }
});

export default router;

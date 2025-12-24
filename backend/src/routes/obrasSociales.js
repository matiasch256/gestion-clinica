import express from "express";
import { getPool } from "../config/database.js";
import sql from "mssql";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM ObrasSociales WHERE Activo = 1 ORDER BY Nombre");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener obras sociales:", err);
    res.status(500).json({ error: "Error al obtener obras sociales" });
  }
});

router.get("/:id/planes", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("idObraSocial", sql.Int, id)
      .query(
        "SELECT * FROM Planes WHERE ID_ObraSocial = @idObraSocial AND Activo = 1 ORDER BY Nombre"
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener planes:", err);
    res.status(500).json({ error: "Error al obtener planes" });
  }
});

export default router;

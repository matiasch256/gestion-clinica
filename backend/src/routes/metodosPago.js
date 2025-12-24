import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT * FROM MetodosPago");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener métodos de pago",
      details: err.message,
    });
  }
});

export default router;

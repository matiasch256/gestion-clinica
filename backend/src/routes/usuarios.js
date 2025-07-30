import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const pool = await getPool();
    await pool.query`INSERT INTO PruebaUsuarios (nombre, email) VALUES (${nombre}, ${email})`;
    res.send({ success: true, mensaje: "Usuario guardado" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

export default router;

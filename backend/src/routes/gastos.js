import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { periodo = "mensual", startYear, endYear } = req.query;
  try {
    const pool = await getPool();
    let query;
    let whereClause = "";
    if (startYear && endYear) {
      whereClause = `WHERE YEAR(C.fecha) BETWEEN ${startYear} AND ${endYear}`;
    } else if (startYear) {
      whereClause = `WHERE YEAR(C.fecha) >= ${startYear}`;
    } else if (endYear) {
      whereClause = `WHERE YEAR(C.fecha) <= ${endYear}`;
    }
    if (periodo === "mensual") {
      query = `
        SELECT 
          FORMAT(C.fecha, 'yyyy-MM') AS periodo,
          SUM(DC.Precio * DC.Cantidad) AS total_gastado
        FROM Compras C
        JOIN DetalleCompra DC ON C.id = DC.IdCompra
        ${whereClause}
        GROUP BY FORMAT(C.fecha, 'yyyy-MM')
        ORDER BY periodo
      `;
    } else if (periodo === "trimestral") {
      query = `
        SELECT 
          CONCAT(YEAR(C.fecha), '-Q', DATEPART(QUARTER, C.fecha)) AS periodo,
          SUM(DC.Precio * DC.Cantidad) AS total_gastado
        FROM Compras C
        JOIN DetalleCompra DC ON C.id = DC.IdCompra
        ${whereClause}
        GROUP BY YEAR(C.fecha), DATEPART(QUARTER, C.fecha)
        ORDER BY YEAR(C.fecha), DATEPART(QUARTER, C.fecha)
      `;
    } else if (periodo === "anual") {
      query = `
        SELECT 
          CAST(YEAR(C.fecha) AS NVARCHAR) AS periodo,
          SUM(DC.Precio * DC.Cantidad) AS total_gastado
        FROM Compras C
        JOIN DetalleCompra DC ON C.id = DC.IdCompra
        ${whereClause}
        GROUP BY YEAR(C.fecha)
        ORDER BY YEAR(C.fecha)
      `;
    } else {
      return res.status(400).json({ error: "Período no válido" });
    }
    const result = await pool.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error(`Error al obtener gastos por ${periodo}:`, error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

export default router;

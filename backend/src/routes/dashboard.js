import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

router.get("/compras-metrics", async (req, res) => {
  try {
    const pool = await getPool();

    const totalMesResult = await pool.query(`
      SELECT SUM(dc.Cantidad * dc.Precio) AS total
      FROM Compras c JOIN DetalleCompra dc ON c.id = dc.IdCompra
      WHERE MONTH(c.fecha) = MONTH(GETDATE()) AND YEAR(c.fecha) = YEAR(GETDATE());
    `);
    const totalCompradoMes = totalMesResult.recordset[0]?.total || 0;

    const facturasRecientesResult = await pool.query(`
      SELECT COUNT(*) AS total FROM Compras WHERE fecha >= DATEADD(day, -7, GETDATE());
    `);
    const facturasRecientes = facturasRecientesResult.recordset[0]?.total || 0;

    const stockCriticoResult = await pool.query(`
      SELECT COUNT(*) AS total FROM Productos WHERE stock <= stockMinimo;
    `);
    const stockCritico = stockCriticoResult.recordset[0]?.total || 0;

    const ordenesPendientesResult = await pool.query(`
      SELECT COUNT(*) AS total FROM Compras WHERE estado = 'Pendiente';
    `);
    const ordenesPendientes = ordenesPendientesResult.recordset[0]?.total || 0;

    const listaOrdenesRecientesResult = await pool.query(`
  SELECT TOP 3
    C.id,
    P.nombre AS proveedorNombre,
    C.fecha,
    C.estado,
    (SELECT SUM(dc.Cantidad * dc.Precio) FROM DetalleCompra dc WHERE dc.IdCompra = C.id) AS total
  FROM Compras C
  JOIN Proveedores P ON C.proveedor = P.id
  ORDER BY C.fecha DESC;
`);
    const listaOrdenesRecientes = listaOrdenesRecientesResult.recordset;

    const listaStockCriticoResult = await pool.query(`
      SELECT TOP 3 nombre, stock
      FROM Productos
      WHERE stock <= stockMinimo
      ORDER BY stock ASC;
    `);
    const listaStockCritico = listaStockCriticoResult.recordset;

    res.status(200).json({
      totalCompradoMes,
      facturasRecientes,
      stockCritico,
      ordenesPendientes,
      listaOrdenesRecientes,
      listaStockCritico,
    });
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    res
      .status(500)
      .json({ error: "Error en el servidor al obtener métricas." });
  }
});

export default router;

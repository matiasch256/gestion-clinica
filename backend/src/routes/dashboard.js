// src/routes/dashboard.js
import express from "express";
import { getPool } from "../config/database.js";

const router = express.Router();

// Endpoint para las métricas del dashboard de compras
router.get("/compras-metrics", async (req, res) => {
  try {
    const pool = await getPool();

    // 1. Total Comprado en el Mes Actual
    const totalMesResult = await pool.query(`
      SELECT SUM(dc.Cantidad * dc.Precio) AS total
      FROM Compras c
      JOIN DetalleCompra dc ON c.id = dc.IdCompra
      WHERE MONTH(c.fecha) = MONTH(GETDATE()) AND YEAR(c.fecha) = YEAR(GETDATE());
    `);
    const totalMes = totalMesResult.recordset[0]?.total || 0;

    // 2. Facturas Recientes (últimos 7 días)
    const facturasRecientesResult = await pool.query(`
      SELECT COUNT(*) AS total
      FROM Compras
      WHERE fecha >= DATEADD(day, -7, GETDATE());
    `);
    const facturasRecientes = facturasRecientesResult.recordset[0]?.total || 0;

    // NOTA: Para las siguientes métricas, necesitarás adaptar las consultas
    // a cómo tengas estructurada tu base de datos (ej. tablas de stock y órdenes).
    // Estos son ejemplos funcionales que podrías necesitar ajustar.

    // 3. Stock Crítico (Ejemplo: cantidad < 10)
    // Asumimos que tenés una tabla 'Productos' con columnas 'stock' y 'stockMinimo'
    const stockCriticoResult = await pool.query(`
      SELECT COUNT(*) AS total FROM Productos WHERE stock <= stockMinimo;
    `);
    const stockCritico = stockCriticoResult.recordset[0]?.total || 0;

    // 4. Órdenes Pendientes (Ejemplo)
    // COMENTAMOS LA CONSULTA PORQUE LA COLUMNA 'estado' NO EXISTE
    /*
const ordenesPendientesResult = await pool.query(`
  SELECT COUNT(*) AS total FROM Compras WHERE estado = 'Pendiente';
`);
const ordenesPendientes = ordenesPendientesResult.recordset[0]?.total || 0;
*/
    // Y LE ASIGNAMOS 0 MANUALMENTE POR AHORA
    const ordenesPendientes = 1;

    // Devolver todos los datos en un solo objeto
    res.status(200).json({
      totalCompradoMes: totalMes,
      facturasRecientes: facturasRecientes,
      stockCritico: stockCritico,
      ordenesPendientes: ordenesPendientes,
    });
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    res
      .status(500)
      .json({ error: "Error en el servidor al obtener métricas." });
  }
});

export default router;

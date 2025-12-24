import express from "express";
import { getPool } from "../config/database.js";
import sql from "mssql";

const router = express.Router();

router.get("/stock-critico", async (req, res) => {
  const topN = req.query.topN || 5;

  try {
    const pool = await getPool();

    const query = `
      SELECT TOP (@topN)
        P.codigo,
        P.nombre,
        P.stock AS stockActual,
        P.stockMinimo,
        (P.stockMinimo - P.stock) AS Deficit, -- Campo clave para el gráfico
        (
            SELECT TOP 1 PR.nombre
            FROM DetalleCompra DC
            JOIN Compras C ON DC.IdCompra = C.id
            JOIN proveedores PR ON C.proveedor = PR.id
            WHERE DC.NombreProducto = P.nombre
            ORDER BY C.fecha DESC
        ) AS ProveedorNombre,
        (
            SELECT MAX(C.fecha)
            FROM DetalleCompra DC
            JOIN Compras C ON DC.IdCompra = C.id
            WHERE DC.NombreProducto = P.nombre
        ) AS FechaUltimaCompra
      FROM
        productos P
      WHERE
        P.stock <= P.stockMinimo
        AND P.activo = 1
      ORDER BY
        Deficit DESC; -- Ordenamos por el mayor problema
    `;

    const request = pool.request();
    request.input("topN", sql.Int, topN);
    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error al generar reporte de stock crítico:", err);
    res.status(500).json({
      error: "Error al generar el reporte",
      details: err.message,
    });
  }
});

router.get("/ausentismo", async (req, res) => {
  const { fechaDesde, fechaHasta, idProfesional, idEspecialidad } = req.query;

  if (!fechaDesde || !fechaHasta) {
    return res.status(400).json({
      error: "Se requiere un rango de fechas (fechaDesde y fechaHasta).",
    });
  }

  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("fechaDesde", sql.Date, fechaDesde);
    request.input("fechaHasta", sql.Date, fechaHasta);
    request.input("idProfesional", sql.Int, idProfesional || null);
    request.input("idEspecialidad", sql.Int, idEspecialidad || null);

    const resumenQuery = `
      WITH TurnosFiltrados AS (
        SELECT
          T.ID_EstadoTurno,
          E.Descripcion AS Estado
        FROM TurnosMedicos T
        JOIN EstadosTurnoMedico E ON T.ID_EstadoTurno = E.ID_EstadoTurno
        JOIN Medicos M ON T.ID_Medico = M.ID_Medico
        WHERE
          CAST(T.FechaHora AS DATE) BETWEEN @fechaDesde AND @fechaHasta
          AND (@idProfesional IS NULL OR T.ID_Medico = @idProfesional)
          AND (@idEspecialidad IS NULL OR M.ID_Especialidad = @idEspecialidad)
      )
      SELECT
        COUNT(*) AS TotalTurnos,
        ISNULL(SUM(CASE WHEN Estado = 'Completado' THEN 1 ELSE 0 END), 0) AS TotalCompletados,
        ISNULL(SUM(CASE WHEN Estado = 'Ausente' THEN 1 ELSE 0 END), 0) AS TotalAusentes,
        ISNULL(SUM(CASE WHEN Estado = 'Cancelado' THEN 1 ELSE 0 END), 0) AS TotalCancelados,
        ISNULL(SUM(CASE WHEN Estado IN ('En espera', 'Programado') THEN 1 ELSE 0 END), 0) AS TotalPendientes
      FROM TurnosFiltrados;
    `;

    const detallesQuery = `
      SELECT
        P.Nombre AS PacienteNombre,
        P.Apellido AS PacienteApellido,
        T.FechaHora,
        M.Nombre AS MedicoNombre,
        M.Apellido AS MedicoApellido,
        E.Descripcion AS Estado
      FROM TurnosMedicos T
      JOIN Pacientes P ON T.ID_Paciente = P.ID_Paciente
      JOIN Medicos M ON T.ID_Medico = M.ID_Medico
      JOIN EstadosTurnoMedico E ON T.ID_EstadoTurno = E.ID_EstadoTurno
      WHERE
        CAST(T.FechaHora AS DATE) BETWEEN @fechaDesde AND @fechaHasta
        AND (@idProfesional IS NULL OR T.ID_Medico = @idProfesional)
        AND (@idEspecialidad IS NULL OR M.ID_Especialidad = @idEspecialidad)
      ORDER BY T.FechaHora DESC;
    `;

    const resumenResult = await request.query(resumenQuery);
    const detallesResult = await request.query(detallesQuery);

    const resumen = resumenResult.recordset[0];
    let porcentajeAusentismo = 0;

    if (resumen.TotalTurnos > 0) {
      porcentajeAusentismo =
        (resumen.TotalAusentes / resumen.TotalTurnos) * 100;
    }

    res.json({
      summary: {
        ...resumen,
        PorcentajeAusentismo: porcentajeAusentismo.toFixed(2),
      },
      details: detallesResult.recordset,
    });
  } catch (err) {
    console.error("Error al generar reporte de ausentismo:", err);
    res.status(500).json({
      error: "Error al generar el reporte",
      details: err.message,
    });
  }
});

const getPeriodQuery = (periodo, dateColumn) => {
  switch (periodo) {
    case "mensual":
      return {
        select: `FORMAT(${dateColumn}, 'yyyy-MM') AS periodo`,
        groupBy: `FORMAT(${dateColumn}, 'yyyy-MM')`,
      };
    case "trimestral":
      return {
        select: `CONCAT(YEAR(${dateColumn}), '-Q', DATEPART(QUARTER, ${dateColumn})) AS periodo`,
        groupBy: `YEAR(${dateColumn}), DATEPART(QUARTER, ${dateColumn})`,
      };
    case "anual":
    default:
      return {
        select: `CAST(YEAR(${dateColumn}) AS NVARCHAR) AS periodo`,
        groupBy: `YEAR(${dateColumn})`,
      };
  }
};

const getWhereClause = (startYear, endYear, dateColumn) => {
  if (startYear && endYear) {
    return `WHERE YEAR(${dateColumn}) BETWEEN @startYear AND @endYear`;
  }
  if (startYear) {
    return `WHERE YEAR(${dateColumn}) >= @startYear`;
  }
  if (endYear) {
    return `WHERE YEAR(${dateColumn}) <= @endYear`;
  }
  return "";
};

router.get("/rentabilidad", async (req, res) => {
  const { periodo = "anual", startYear, endYear } = req.query;

  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("startYear", sql.Int, startYear || null);
    request.input("endYear", sql.Int, endYear || null);

    const ingresosPeriod = getPeriodQuery(periodo, "FechaEmision");
    const ingresosWhere = getWhereClause(startYear, endYear, "FechaEmision");
    const ingresosQuery = `
      SELECT
        ${ingresosPeriod.select},
        SUM(Total) AS total_ingresos
      FROM FacturasPacientes
      ${ingresosWhere}
      GROUP BY ${ingresosPeriod.groupBy}
      ORDER BY periodo;
    `;

    const costosPeriod = getPeriodQuery(periodo, "C.fecha");
    const costosWhere = getWhereClause(startYear, endYear, "C.fecha");
    const costosQuery = `
      SELECT
        ${costosPeriod.select},
        SUM(DC.Precio * DC.Cantidad) AS total_costos
      FROM Compras C
      JOIN DetalleCompra DC ON C.id = DC.IdCompra
      ${costosWhere}
      GROUP BY ${costosPeriod.groupBy}
      ORDER BY periodo;
    `;

    const [ingresosResult, costosResult] = await Promise.all([
      request.query(ingresosQuery),
      request.query(costosQuery),
    ]);

    const rentabilidadMap = new Map();

    ingresosResult.recordset.forEach((item) => {
      rentabilidadMap.set(item.periodo, {
        periodo: item.periodo,
        ingresos: item.total_ingresos || 0,
        costos: 0,
      });
    });

    costosResult.recordset.forEach((item) => {
      const entrada = rentabilidadMap.get(item.periodo) || {
        periodo: item.periodo,
        ingresos: 0,
        costos: 0,
      };
      entrada.costos = item.total_costos || 0;
      rentabilidadMap.set(item.periodo, entrada);
    });

    const resultadoFinal = Array.from(rentabilidadMap.values())
      .map((item) => ({
        ...item,
        utilidad: item.ingresos - item.costos,
      }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo));
    res.json(resultadoFinal);
  } catch (error) {
    console.error(`Error al obtener rentabilidad:`, error);
    res
      .status(500)
      .json({ error: "Error al obtener datos", details: error.message });
  }
});

router.get("/stock-por-categoria", async (req, res) => {
  try {
    const pool = await getPool();
    const request = pool.request();

    const detalleQuery = `
      WITH UltimoPrecio AS (
        SELECT
          p.id AS ID_Producto,
          p.categoriaId,
          p.stock,
          dc.Precio,
          ROW_NUMBER() OVER(
            PARTITION BY p.id
            ORDER BY c.fecha DESC
          ) as rn
        FROM
          productos p
        LEFT JOIN
          DetalleCompra dc ON p.nombre = dc.NombreProducto
        LEFT JOIN
          Compras c ON dc.IdCompra = c.id
        WHERE
          p.activo = 1
      ),
      Valorizado AS (
        SELECT
          v.categoriaId,
          v.stock,
          ISNULL(v.Precio, 0) AS UltimoPrecio,
          (v.stock * ISNULL(v.Precio, 0)) AS ValorProducto
        FROM
          UltimoPrecio v
        WHERE
          v.rn = 1
      )
      SELECT
        cat.nombre AS CategoriaNombre,
        SUM(v.stock) AS CantidadTotal,
        SUM(v.ValorProducto) AS ValorTotal
      FROM
        Valorizado v
      JOIN
        categorias cat ON v.categoriaId = cat.id
      GROUP BY
        cat.nombre
      ORDER BY
        ValorTotal DESC;
    `;

    const resumenQuery = `
      SELECT
        COUNT(DISTINCT id) AS TotalProductos,
        SUM(stock) AS StockTotal,
        COUNT(DISTINCT categoriaId) AS TotalCategorias
      FROM productos
      WHERE activo = 1;
    `;

    const [detalleResult, resumenResult] = await Promise.all([
      request.query(detalleQuery),
      request.query(resumenQuery),
    ]);

    res.json({
      summary: resumenResult.recordset[0],
      details: detalleResult.recordset,
    });
  } catch (error) {
    console.error(`Error al obtener stock por categoría:`, error);
    res
      .status(500)
      .json({ error: "Error al obtener datos", details: error.message });
  }
});

export default router;

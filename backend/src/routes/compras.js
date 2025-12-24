import express from "express";
import { getPool } from "../config/database.js";
import { normalizeDate } from "../utils/dateUtils.js";
import sql from "mssql";

const router = express.Router();

router.post("/", async (req, res) => {
  const { proveedor, fecha, productos } = req.body;

  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const normalizedDate = normalizeDate(fecha);
    if (!normalizedDate) {
      throw new Error("Formato de fecha inválido");
    }

    let request = transaction.request();

    const compraResult = await request
      .input("proveedor", sql.Int, proveedor)
      .input("fecha", sql.Date, normalizedDate).query(`
        INSERT INTO Compras (proveedor, fecha)
        OUTPUT INSERTED.id
        VALUES (@proveedor, @fecha)
      `);

    const compraId = compraResult.recordset[0].id;

    for (const p of productos) {
      request = transaction.request();
      await request
        .input("compraId", sql.Int, compraId)
        .input("nombre", sql.NVarChar, p.nombre)
        .input("cantidad", sql.Int, p.cantidad)
        .input("precio", sql.Decimal(10, 2), p.precio).query(`
          INSERT INTO DetalleCompra (IdCompra, NombreProducto, Cantidad, Precio)
          VALUES (@compraId, @nombre, @cantidad, @precio)
        `);

      request = transaction.request();
      await request
        .input("cantidad", sql.Int, p.cantidad)
        .input("nombre", sql.NVarChar, p.nombre).query(`
          UPDATE productos
          SET stock = stock + @cantidad
          WHERE nombre = @nombre
        `);
    }

    await transaction.commit();

    res
      .status(200)
      .json({ message: "Compra registrada y stock actualizado correctamente" });
  } catch (error) {
    await transaction.rollback();

    console.error("Error al registrar la compra:", error);
    res.status(500).json({
      error: "Error al registrar la compra en el servidor.",
      details: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const comprasResult = await pool.query(`
      SELECT
        C.id,
        C.proveedor,
        CONVERT(VARCHAR, C.fecha, 23) AS fecha,
        P.nombre AS proveedorNombre,
        C.estado
      FROM Compras C
      JOIN Proveedores P ON C.proveedor = P.id
      -- LÍNEA MODIFICADA --
      ORDER BY C.fecha DESC, C.id DESC
    `);

    const compras = comprasResult.recordset;
    for (let compra of compras) {
      const detallesResult = await pool.query`
        SELECT * FROM DetalleCompra WHERE IdCompra = ${compra.id}
      `;
      compra.productos = detallesResult.recordset;
    }

    res.status(200).json(compras);
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las compras", details: error.message });
  }
});
router.get("/cantidad-compras", async (req, res) => {
  try {
    const topN = parseInt(req.query.topN) ?? 10;
    const periodo = req.query.periodo ?? "anual";
    if (![5, 10].includes(topN)) {
      return res.status(400).json({ error: "topN debe ser 5 o 10" });
    }
    let startDate;
    const currentDate = new Date();
    if (periodo === "mensual") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    } else if (periodo === "trimestral") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    } else if (periodo === "semestral") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    } else if (periodo === "anual") {
      startDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() - 1)
      );
    } else {
      return res.status(400).json({ error: "Período inválido" });
    }
    const pool = await getPool();
    const request = pool.request();
    request.input("topN", topN);
    request.input("startDate", startDate);
    const result = await request.query(`
      SELECT TOP (@topN) d.NombreProducto, SUM(d.Cantidad) AS TotalCantidad
      FROM DetalleCompra d
      INNER JOIN Compras c ON d.IdCompra = c.id
      WHERE c.fecha >= @startDate
      GROUP BY d.NombreProducto
      ORDER BY SUM(d.Cantidad) DESC
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error en la consulta:", error.message, error.stack);
    res.status(500).json({
      error: "Error en la consulta",
      details: error.message,
      sqlMessage: error.originalError
        ? error.originalError.info.message
        : "No SQL message",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const compraResult = await pool.query(`
      SELECT C.id, C.proveedor, CONVERT(VARCHAR, C.fecha, 23) AS fecha, P.nombre AS proveedorNombre
      FROM Compras C
      JOIN Proveedores P ON C.proveedor = P.id
      WHERE C.id = ${id}
    `);
    const compra = compraResult.recordset[0];
    if (!compra) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    const detallesResult =
      await pool.query`SELECT * FROM DetalleCompra WHERE IdCompra = ${id}`;
    compra.productos = detallesResult.recordset;
    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la compra" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { proveedor, fecha, productos } = req.body;
  try {
    const pool = await getPool();
    const normalizedDate = normalizeDate(fecha);
    if (!normalizedDate) {
      return res.status(400).json({ error: "Formato de fecha inválido" });
    }
    const resultCompra =
      await pool.query`SELECT * FROM Compras WHERE id = ${id}`;
    if (resultCompra.recordset.length === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    await pool.query`
      UPDATE Compras
      SET proveedor = ${proveedor?.trim()}, fecha = ${normalizedDate}
      WHERE id = ${id}
    `;
    await pool.query`DELETE FROM DetalleCompra WHERE IdCompra = ${id}`;
    for (const p of productos) {
      await pool.query`
        INSERT INTO DetalleCompra (IdCompra, NombreProducto, Cantidad, Precio)
        VALUES (${id}, ${p.NombreProducto?.trim()}, ${p.Cantidad}, ${p.Precio})
      `;
    }
    res.status(200).json({ message: "Compra actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la compra" });
  }
});

router.put("/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  const estadosValidos = [
    "Pendiente",
    "Aprobada",
    "Pedido",
    "Completada",
    "Cancelada",
  ];
  if (!estadosValidos.includes(nuevoEstado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  try {
    const pool = await getPool();
    await pool.query`
      UPDATE Compras
      SET estado = ${nuevoEstado}
      WHERE id = ${id}
    `;
    res
      .status(200)
      .json({ message: `Compra actualizada al estado: ${nuevoEstado}` });
  } catch (error) {
    console.error("Error al actualizar estado de la compra:", error);
    res
      .status(500)
      .json({ error: "Error en el servidor", details: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const compraExistente =
      await pool.query`SELECT * FROM Compras WHERE id = ${id}`;
    if (compraExistente.recordset.length === 0) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    await pool.query`DELETE FROM DetalleCompra WHERE IdCompra = ${id}`;
    await pool.query`DELETE FROM Compras WHERE id = ${id}`;
    res.status(200).json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    res.status(500).json({ error: "Error al eliminar la compra" });
  }
});

export default router;

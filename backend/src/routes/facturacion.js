import express from "express";
import { getPool } from "../config/database.js";
import sql from "mssql";

const router = express.Router();

router.post("/", async (req, res) => {
  const { ID_Paciente, servicios, NumeroFactura, ID_MetodoPago } = req.body;

  if (
    !ID_Paciente ||
    !servicios ||
    servicios.length === 0 ||
    !NumeroFactura ||
    !ID_MetodoPago
  ) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    let request = transaction.request();
    request.input("NumeroFactura", sql.VarChar, NumeroFactura);
    const checkFactura = await request.query(
      "SELECT ID_FacturaPaciente FROM FacturasPacientes WHERE NumeroFactura = @NumeroFactura"
    );

    if (checkFactura.recordset.length > 0) {
      return res.status(409).json({
        error: "El número de factura ya está registrado.",
        details: "El número de factura ya está registrado.",
      });
    }

    let totalFactura = 0;
    for (const servicio of servicios) {
      totalFactura += servicio.CostoBase * servicio.cantidad;
    }

    request = transaction.request();
    request.input("ID_Paciente", sql.Int, ID_Paciente);
    request.input("Total", sql.Decimal(12, 2), totalFactura);
    request.input("NumeroFactura", sql.VarChar, NumeroFactura);
    request.input("ID_MetodoPago", sql.Int, ID_MetodoPago);

    const resultFactura = await request.query(`
      INSERT INTO FacturasPacientes (FechaEmision, ID_Paciente, ID_EstadoFactura, Total, NumeroFactura, ID_MetodoPago)
      OUTPUT INSERTED.ID_FacturaPaciente
      VALUES (GETDATE(), @ID_Paciente, 1, @Total, @NumeroFactura, @ID_MetodoPago)
    `);

    const nuevaFacturaId = resultFactura.recordset[0].ID_FacturaPaciente;

    for (const servicio of servicios) {
      request = transaction.request();
      await request
        .input("ID_FacturaPaciente", sql.Int, nuevaFacturaId)
        .input("ID_Servicio", sql.Int, servicio.ID_Servicio)
        .input("Cantidad", sql.Int, servicio.cantidad)
        .input("PrecioUnitario", sql.Decimal(10, 2), servicio.CostoBase)
        .input(
          "SubTotal",
          sql.Decimal(12, 2),
          servicio.CostoBase * servicio.cantidad
        ).query(`
          INSERT INTO DetallesFacturaPaciente (ID_FacturaPaciente, ID_Servicio, Cantidad, PrecioUnitario, SubTotal)
          VALUES (@ID_FacturaPaciente, @ID_Servicio, @Cantidad, @PrecioUnitario, @SubTotal)
        `);
    }

    await transaction.commit();
    res.status(201).json({
      message: "Factura registrada exitosamente",
      facturaId: nuevaFacturaId,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error al registrar la factura:", err);
    res
      .status(500)
      .json({ error: "Error al registrar la factura", details: err.message });
  }
});

router.get("/", async (req, res) => {
  const { paciente, estado, numeroFactura } = req.query;

  try {
    const pool = await getPool();
    const request = pool.request();

    let query = `
      SELECT
        FP.ID_FacturaPaciente,
        FP.FechaEmision,
        FP.NumeroFactura, -- Añadido para mostrar y filtrar
        FP.Total,
        P.Nombre + ' ' + P.Apellido AS Paciente,
        EFP.Descripcion AS Estado
      FROM FacturasPacientes FP
      JOIN Pacientes P ON FP.ID_Paciente = P.ID_Paciente
      JOIN EstadosFacturaPaciente EFP ON FP.ID_EstadoFactura = EFP.ID_EstadoFactura
      WHERE 1=1
    `;

    if (paciente) {
      query += " AND (P.Nombre LIKE @paciente OR P.Apellido LIKE @paciente)";
      request.input("paciente", sql.VarChar, `%${paciente}%`);
    }
    if (estado) {
      query += " AND EFP.Descripcion = @estado";
      request.input("estado", sql.VarChar, estado);
    }
    if (numeroFactura) {
      query += " AND FP.NumeroFactura LIKE @numeroFactura";
      request.input("numeroFactura", sql.VarChar, `%${numeroFactura}%`);
    }

    query += " ORDER BY FP.FechaEmision DESC";

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las facturas:", err);
    res
      .status(500)
      .json({ error: "Error al obtener las facturas", details: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("facturaId", sql.Int, id);

    const resultFactura = await request.query(`
      SELECT
        FP.ID_FacturaPaciente, FP.FechaEmision, FP.Total,
        P.Nombre AS NombrePaciente, P.Apellido AS ApellidoPaciente, P.DNI, P.Email, P.Telefono,
        EFP.Descripcion AS Estado
      FROM FacturasPacientes FP
      JOIN Pacientes P ON FP.ID_Paciente = P.ID_Paciente
      JOIN EstadosFacturaPaciente EFP ON FP.ID_EstadoFactura = EFP.ID_EstadoFactura
      WHERE FP.ID_FacturaPaciente = @facturaId
    `);

    if (resultFactura.recordset.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const resultDetalles = await request.query(`
      SELECT
        S.Nombre AS Servicio,
        DFP.Cantidad,
        DFP.PrecioUnitario,
        DFP.SubTotal
      FROM DetallesFacturaPaciente DFP
      JOIN Servicios S ON DFP.ID_Servicio = S.ID_Servicio
      WHERE DFP.ID_FacturaPaciente = @facturaId
    `);

    const facturaCompleta = {
      ...resultFactura.recordset[0],
      detalles: resultDetalles.recordset,
    };

    res.json(facturaCompleta);
  } catch (err) {
    console.error("Error al obtener el detalle de la factura:", err);
    res.status(500).json({
      error: "Error al obtener el detalle de la factura",
      details: err.message,
    });
  }
});

router.put("/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  try {
    const pool = await getPool();

    const checkPagos = await pool
      .request()
      .input("facturaId", sql.Int, id)
      .query(
        "SELECT COUNT(*) as total FROM Pagos WHERE ID_FacturaPaciente = @facturaId"
      );

    const tienePagos = checkPagos.recordset[0].total > 0;

    if (nuevoEstado === "Anulada" && tienePagos) {
      return res.status(409).json({
        error:
          "Acción denegada: No se puede anular una factura que ya tiene pagos registrados.",
      });
    }

    if (nuevoEstado === "Pendiente de Pago") {
      const estadoActualResult = await pool
        .request()
        .input("facturaId", sql.Int, id)
        .query(
          "SELECT EFP.Descripcion FROM FacturasPacientes FP JOIN EstadosFacturaPaciente EFP ON FP.ID_EstadoFactura = EFP.ID_EstadoFactura WHERE FP.ID_FacturaPaciente = @facturaId"
        );

      const estadoActual = estadoActualResult.recordset[0].Descripcion;

      if (estadoActual === "Pagada") {
        return res.status(409).json({
          error:
            "Acción denegada: No se puede reabrir una factura que ya está marcada como Pagada.",
        });
      }
    }

    const resultEstado = await pool
      .request()
      .input("nuevoEstado", sql.VarChar, nuevoEstado)
      .query(
        `SELECT ID_EstadoFactura FROM EstadosFacturaPaciente WHERE Descripcion = @nuevoEstado`
      );

    if (resultEstado.recordset.length === 0) {
      return res
        .status(400)
        .json({ error: "El estado proporcionado no es válido." });
    }
    const nuevoEstadoId = resultEstado.recordset[0].ID_EstadoFactura;

    const request = pool.request();
    request.input("facturaId", sql.Int, id);
    request.input("nuevoEstadoId", sql.Int, nuevoEstadoId);

    const result = await request.query(`
      UPDATE FacturasPacientes
      SET ID_EstadoFactura = @nuevoEstadoId
      WHERE ID_FacturaPaciente = @facturaId
    `);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Estado de la factura actualizado." });
    } else {
      res.status(404).json({ error: "Factura no encontrada." });
    }
  } catch (err) {
    console.error("Error al actualizar estado de la factura:", err);
    res
      .status(500)
      .json({ error: "Error en el servidor", details: err.message });
  }
});

export default router;

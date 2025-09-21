import sql from "mssql";
import express from "express";
import { getPool } from "../config/database.js";

import { enviarEmailConfirmacion } from "../services/emailService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(`
      SELECT 
        T.ID_TurnoMedico, 
        P.Nombre + ' ' + P.Apellido AS Paciente, 
        M.Nombre + ' ' + M.Apellido AS Medico, 
        T.FechaHora,
        ET.Descripcion AS Estado
      FROM TurnosMedicos T
      INNER JOIN Pacientes P ON T.ID_Paciente = P.ID_Paciente
      INNER JOIN Medicos M ON T.ID_Medico = M.ID_Medico
      INNER JOIN EstadosTurnoMedico ET ON T.ID_EstadoTurno = ET.ID_EstadoTurno
      ORDER BY T.FechaHora DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("🔥 ERROR al obtener turnos:", err);
    res.status(500).send("Error en el servidor al obtener turnos");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("turnoId", sql.Int, id);

    const result = await request.query(`
      SELECT
        T.ID_TurnoMedico, T.FechaHora, T.Consultorio,
        P.ID_Paciente, P.Nombre AS NombrePaciente, P.Apellido AS ApellidoPaciente, P.Telefono AS TelefonoPaciente, P.Email AS EmailPaciente,
        M.ID_Medico, M.Nombre AS NombreMedico, M.Apellido AS ApellidoMedico,
        E.Nombre AS Especialidad,
        ET.Descripcion AS Estado,
        T.ID_EstadoTurno -- <-- LÍNEA CLAVE AÑADIDA
      FROM TurnosMedicos T
      JOIN Pacientes P ON T.ID_Paciente = P.ID_Paciente
      JOIN Medicos M ON T.ID_Medico = M.ID_Medico
      JOIN EstadosTurnoMedico ET ON T.ID_EstadoTurno = ET.ID_EstadoTurno
      LEFT JOIN Especialidades E ON M.ID_Especialidad = E.ID_Especialidad
      WHERE T.ID_TurnoMedico = @turnoId
    `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Turno no encontrado" });
    }
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener el detalle del turno",
      details: err.message,
    });
  }
});

router.get("/paciente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("pacienteId", sql.Int, id);

    const result = await request.query(`
      SELECT 
        T.ID_TurnoMedico,
        T.FechaHora,
        M.Nombre + ' ' + M.Apellido AS Medico,
        E.Nombre AS Especialidad,
        S.Nombre AS Servicio,
        S.CostoBase AS Costo,
        ET.Descripcion AS Estado
      FROM TurnosMedicos T
      JOIN Medicos M ON T.ID_Medico = M.ID_Medico
      JOIN EstadosTurnoMedico ET ON T.ID_EstadoTurno = ET.ID_EstadoTurno
      LEFT JOIN Especialidades E ON M.ID_Especialidad = E.ID_Especialidad
      LEFT JOIN DetallesTurnoMedico DT ON T.ID_TurnoMedico = DT.ID_TurnoMedico
      LEFT JOIN Servicios S ON DT.ID_Servicio = S.ID_Servicio
      WHERE T.ID_Paciente = @pacienteId
      ORDER BY T.FechaHora DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener los turnos del paciente:", err);
    res.status(500).json({
      error: "Error al obtener los turnos del paciente",
      details: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { pacienteId, medicoId, fecha, hora, estadoTurnoId, consultorio } =
    req.body;
  const fechaHora = `${fecha}T${hora}`;

  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();
    let request = transaction.request();

    const resultTurno = await request
      .input("ID_Paciente", sql.Int, pacienteId)
      .input("ID_Medico", sql.Int, medicoId)
      .input("FechaHora", sql.DateTime, fechaHora)
      .input("ID_EstadoTurno", sql.Int, estadoTurnoId || 1)
      .input("Consultorio", sql.VarChar(50), consultorio).query(`
        -- 3. Añadimos la columna en el INSERT
        INSERT INTO TurnosMedicos (ID_Paciente, ID_Medico, FechaHora, ID_EstadoTurno, Consultorio)
        OUTPUT INSERTED.ID_TurnoMedico
        VALUES (@ID_Paciente, @ID_Medico, @FechaHora, @ID_EstadoTurno, @Consultorio)
      `);

    const nuevoTurnoId = resultTurno.recordset[0].ID_TurnoMedico;

    request = transaction.request();
    const resultDatosEmail = await request.input(
      "TurnoID",
      sql.Int,
      nuevoTurnoId
    ).query(`
        SELECT
          P.Nombre AS NombrePaciente, P.Apellido AS ApellidoPaciente, P.Email AS EmailPaciente, 
          M.Nombre AS NombreMedico, M.Apellido AS ApellidoMedico,
          E.Nombre AS Especialidad
        FROM TurnosMedicos T
        JOIN Pacientes P ON T.ID_Paciente = P.ID_Paciente
        JOIN Medicos M ON T.ID_Medico = M.ID_Medico
        LEFT JOIN Especialidades E ON M.ID_Especialidad = E.ID_Especialidad
        WHERE T.ID_TurnoMedico = @TurnoID
      `);

    const datosEmail = resultDatosEmail.recordset[0];

    if (datosEmail && datosEmail.EmailPaciente) {
      const datosParaEmail = {
        emailPaciente: datosEmail.EmailPaciente,
        nombrePaciente: `${datosEmail.NombrePaciente} ${datosEmail.ApellidoPaciente}`,
        fechaHora: fechaHora,
        nombreMedico: `${datosEmail.NombreMedico} ${datosEmail.ApellidoMedico}`,
        especialidad: datosEmail.Especialidad,
      };
      enviarEmailConfirmacion(datosParaEmail);
    } else {
      console.warn(
        `El paciente con ID ${pacienteId} no tiene un email registrado. No se envió confirmación.`
      );
    }

    await transaction.commit();
    res.status(200).json({ message: "Turno registrado exitosamente" });
  } catch (err) {
    await transaction.rollback();
    console.error("❌ Error al insertar turno:", err);
    res
      .status(500)
      .json({ error: "Error al registrar turno", details: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { pacienteId, medicoId, fecha, hora, estadoTurnoId, consultorio } =
    req.body;
  const fechaHora = `${fecha}T${hora}`;

  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("turnoId", sql.Int, id);
    request.input("ID_Paciente", sql.Int, pacienteId);
    request.input("ID_Medico", sql.Int, medicoId);
    request.input("FechaHora", sql.DateTime, fechaHora);
    request.input("ID_EstadoTurno", sql.Int, estadoTurnoId);
    request.input("Consultorio", sql.VarChar(50), consultorio);

    const result = await request.query(`
      UPDATE TurnosMedicos
      SET 
        ID_Paciente = @ID_Paciente, 
        ID_Medico = @ID_Medico, 
        FechaHora = @FechaHora, 
        ID_EstadoTurno = @ID_EstadoTurno,
        Consultorio = @Consultorio -- 3. Añadimos la columna en el UPDATE
      WHERE 
        ID_TurnoMedico = @turnoId
    `);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Turno actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Turno no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el turno:", err);
    res.status(500).json({
      error: "Error en el servidor al actualizar el turno",
      details: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const request = pool.request();

    request.input("turnoId", sql.Int, id);

    const result = await request.query(
      `DELETE FROM TurnosMedicos WHERE ID_TurnoMedico = @turnoId`
    );

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Turno eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Turno no encontrado" });
    }
  } catch (err) {
    console.error("Error al eliminar el turno:", err);
    res.status(500).json({
      error: "Error en el servidor al eliminar el turno",
      details: err.message,
    });
  }
});

router.put("/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  try {
    const pool = await getPool();
    const request = pool.request();

    const resultEstado =
      await pool.query`SELECT ID_EstadoTurno FROM EstadosTurnoMedico WHERE Descripcion = ${nuevoEstado}`;
    if (resultEstado.recordset.length === 0) {
      return res
        .status(400)
        .json({ error: "El estado proporcionado no es válido." });
    }
    const nuevoEstadoId = resultEstado.recordset[0].ID_EstadoTurno;

    request.input("turnoId", sql.Int, id);
    request.input("nuevoEstadoId", sql.Int, nuevoEstadoId);

    const result = await request.query(`
      UPDATE TurnosMedicos
      SET ID_EstadoTurno = @nuevoEstadoId
      WHERE ID_TurnoMedico = @turnoId
    `);

    if (result.rowsAffected[0] > 0) {
      res
        .status(200)
        .json({ message: "Estado del turno actualizado correctamente." });
    } else {
      res.status(404).json({ error: "Turno no encontrado." });
    }
  } catch (err) {
    console.error("Error al actualizar el estado del turno:", err);
    res.status(500).json({
      error: "Error en el servidor al actualizar el estado.",
      details: err.message,
    });
  }
});

export default router;

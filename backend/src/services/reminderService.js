import cron from "node-cron";
import { getPool } from "../config/database.js";
import { enviarEmailRecordatorio } from "./emailService.js";

const tareaRecordatorio = async () => {
  console.log("⏰ Ejecutando tarea de recordatorio de turnos...");

  const pool = await getPool();

  try {
    const result = await pool.query(`
      SELECT
        T.ID_TurnoMedico, T.FechaHora, T.Consultorio,
        P.Nombre AS NombrePaciente, P.Apellido AS ApellidoPaciente, P.Email AS EmailPaciente,
        M.Nombre AS NombreMedico, M.Apellido AS ApellidoMedico,
        E.Nombre AS Especialidad
      FROM TurnosMedicos T
      JOIN Pacientes P ON T.ID_Paciente = P.ID_Paciente
      JOIN Medicos M ON T.ID_Medico = M.ID_Medico
      LEFT JOIN Especialidades E ON M.ID_Especialidad = E.ID_Especialidad
      WHERE
        T.FechaHora BETWEEN GETDATE() AND DATEADD(hour, 25, GETDATE())
        AND T.RecordatorioEnviado = 0
        AND P.Email IS NOT NULL;
    `);

    const turnosParaRecordar = result.recordset;
    console.log(
      `Encontrados ${turnosParaRecordar.length} turnos para recordar.`
    );

    for (const turno of turnosParaRecordar) {
      try {
        await enviarEmailRecordatorio({
          emailPaciente: turno.EmailPaciente,
          nombrePaciente: `${turno.NombrePaciente} ${turno.ApellidoPaciente}`,
          fechaHora: turno.FechaHora,
          nombreMedico: `${turno.NombreMedico} ${turno.ApellidoMedico}`,
          especialidad: turno.Especialidad,
          ubicacion: `Consultorio ${turno.Consultorio || "a designar"}`,
        });

        await pool.query`
          UPDATE TurnosMedicos
          SET RecordatorioEnviado = 1, FechaEnvioRecordatorio = GETDATE()
          WHERE ID_TurnoMedico = ${turno.ID_TurnoMedico};
        `;
        console.log(
          `✅ Recordatorio enviado para el turno ID: ${turno.ID_TurnoMedico}`
        );
      } catch (emailError) {
        console.error(
          `❌ Error enviando email para el turno ID: ${turno.ID_TurnoMedico}:`,
          emailError
        );
        await pool.query`
          UPDATE TurnosMedicos
          SET ErrorRecordatorio = ${emailError.message}
          WHERE ID_TurnoMedico = ${turno.ID_TurnoMedico};
        `;
      }
    }
  } catch (dbError) {
    console.error("Error general en la tarea de recordatorios:", dbError);
  }
};

export const iniciarTareaRecordatorios = () => {
  cron.schedule("* * * * *", tareaRecordatorio);
  console.log(
    "🕒 Tarea de recordatorios de turnos programada para ejecutarse cada hora."
  );
};

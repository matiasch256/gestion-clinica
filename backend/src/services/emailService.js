import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST,
  port: process.env.MAILGUN_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS,
  },
});

export const enviarEmailConfirmacion = async (datosTurno) => {
  const {
    emailPaciente,
    nombrePaciente,
    fechaHora,
    nombreMedico,
    especialidad,
  } = datosTurno;

  const fechaFormateada = new Date(fechaHora).toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const horaFormateada = new Date(fechaHora).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: `"Tu Clínica Médica" <turnos@${process.env.MAILGUN_DOMAIN}>`,
    to: "mdmsystem72@gmail.com", // emailPaciente,
    subject: "Confirmación de su Turno Médico",
    html: `
      <h1>Confirmación de Turno</h1>
      <p>Hola ${nombrePaciente},</p>
      <p>Le confirmamos que su turno ha sido agendado exitosamente con los siguientes detalles:</p>
      <ul>
        <li><strong>Profesional:</strong> Dr(a). ${nombreMedico} (${
      especialidad || "Sin especialidad"
    })</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Hora:</strong> ${horaFormateada} hs.</li>
      </ul>
      <p>Por favor, recuerde llegar 15 minutos antes. Si necesita cancelar o reprogramar, contáctenos.</p>
      <p>¡Gracias!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "Email de confirmación (vía Mailgun) enviado a:",
      emailPaciente
    );
  } catch (error) {
    console.error("Error al enviar el email con Mailgun:", error);
  }
};

export const enviarEmailRecordatorio = async (datosTurno) => {
  const {
    emailPaciente,
    nombrePaciente,
    fechaHora,
    nombreMedico,
    especialidad,
    ubicacion,
  } = datosTurno;

  const fechaFormateada = new Date(fechaHora).toLocaleDateString(/*...*/);
  const horaFormateada = new Date(fechaHora).toLocaleTimeString(/*...*/);

  const mailOptions = {
    from: `"Recordatorio de Cita - Tu Clínica" <no-responder@${process.env.MAILGUN_DOMAIN}>`,
    to: "mdmsystem72@gmail.com", //emailPaciente,
    subject: "Recordatorio de su Turno Médico para Mañana",
    html: `
      <h1>Recordatorio de Turno</h1>
      <p>Hola ${nombrePaciente},</p>
      <p>Le recordamos su próxima cita en nuestra clínica:</p>
      <ul>
        <li><strong>Profesional:</strong> Dr(a). ${nombreMedico} (${
      especialidad || ""
    })</li>
        <li><strong>Fecha:</strong> ${fechaFormateada}</li>
        <li><strong>Hora:</strong> ${horaFormateada} hs.</li>
        <li><strong>Ubicación:</strong> ${ubicacion}</li>
      </ul>
      <p>Si no puede asistir, por favor contáctenos con anticipación para reprogramar.</p>
      <p>¡Lo esperamos!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

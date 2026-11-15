// Qué color de estado corresponde a cada texto de estado.
const STATUS_COLORS = {
  success: [
    "activo",
    "activa",
    "aprobada",
    "completada",
    "completado",
    "pagada",
    "pagado",
    "atendido",
    "confirmado",
    "realizado",
  ],
  info: ["programado", "reservado"],
  warning: [
    "pendiente",
    "pendiente de pago",
    "en espera",
    "parcial",
    "ausente",
  ],
  error: [
    "cancelada",
    "cancelado",
    "inactivo",
    "inactiva",
    "eliminada",
    "anulada",
    "anulado",
    "vencida",
  ],
};

export const getStatusColor = (status) => {
  const value = String(status || "").toLowerCase();
  const match = Object.entries(STATUS_COLORS).find(([, words]) =>
    words.includes(value)
  );
  return match ? match[0] : "default";
};

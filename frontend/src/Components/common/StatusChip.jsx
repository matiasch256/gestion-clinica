import { Chip } from "@mui/material";
import { getStatusColor } from "../../utils/status";

// Único componente para mostrar estados: el color siempre significa lo mismo.
// "color" permite forzar el tono (success, warning, error, info, default).
const StatusChip = ({ status, color, sx }) => {
  const tone = color || getStatusColor(status);
  const tinted = tone !== "default";
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        minWidth: 88,
        textTransform: "capitalize",
        bgcolor: tinted ? `${tone}.lighter` : "neutral.200",
        color: tinted ? `${tone}.dark` : "text.secondary",
        ...sx,
      }}
    />
  );
};

export default StatusChip;

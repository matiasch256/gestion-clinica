import { Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PageHeader from "./PageHeader";

// Cabecera de los paneles: la misma de cualquier pantalla, con la fecha de hoy.
const DashboardHeader = ({
  title = "Panel de control",
  subtitle = "Resumen de la actividad del sistema",
}) => {
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      actions={
        <Chip
          icon={<CalendarTodayIcon />}
          label={today.charAt(0).toUpperCase() + today.slice(1)}
          sx={{
            display: { xs: "none", md: "inline-flex" },
            bgcolor: "primary.lighter",
            color: "primary.dark",
            "& .MuiChip-icon": { color: "inherit", fontSize: 16, ml: 1 },
          }}
        />
      }
    />
  );
};

export default DashboardHeader;

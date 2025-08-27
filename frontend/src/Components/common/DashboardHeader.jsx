import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const DashboardHeader = ({ currentUser }) => {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        background:
          "linear-gradient(to right, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))",
        border: "1px solid rgba(25, 118, 210, 0.2)",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ mb: "8px" }}>
          Bienvenido, {currentUser?.name || "Usuario"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aquí tienes un resumen de la actividad del sistema.
        </Typography>
      </Box>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: "8px",
          color: "#1976d2",
        }}
      >
        <CalendarTodayIcon sx={{ fontSize: "20px" }} />{" "}
        <Typography variant="body2">{today}</Typography>
      </Box>
    </Box>
  );
};

export default DashboardHeader;

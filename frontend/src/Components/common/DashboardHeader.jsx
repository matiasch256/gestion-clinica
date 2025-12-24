import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const DashboardHeader = () => {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.02)",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Panel de Control
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aquí tienes un resumen de la actividad del sistema.
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: 1,
          color: "primary.main",
          bgcolor: "primary.lighter",
          p: 1,
          borderRadius: 1,
        }}
      >
        <CalendarTodayIcon fontSize="small" />
        <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
          {today}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardHeader;

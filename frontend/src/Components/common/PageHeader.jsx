import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Cabecera única de todas las pantallas: título a la izquierda,
// acciones a la derecha, siempre en la misma posición.
const PageHeader = ({ title, subtitle, onBack, actions }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 2,
      mb: 3,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
      {onBack && (
        <Tooltip title="Volver">
          <IconButton onClick={onBack} edge="start" aria-label="Volver">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    {actions && (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>{actions}</Box>
    )}
  </Box>
);

export default PageHeader;

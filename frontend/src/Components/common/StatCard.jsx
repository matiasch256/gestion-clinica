import { Box, Paper, Typography } from "@mui/material";

// Tarjeta de métrica. "tone" es un color del tema (primary, success,
// warning, error, info) y solo se usa para comunicar un estado.
const StatCard = ({ title, value, caption, icon: Icon, tone = "primary" }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      height: "100%",
      borderRadius: 3,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 2,
    }}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" component="p" sx={{ my: 0.5 }} noWrap>
        {value}
      </Typography>
      {caption && (
        <Typography variant="caption" color="text.secondary">
          {caption}
        </Typography>
      )}
    </Box>
    {Icon && (
      <Box
        sx={{
          display: "flex",
          p: 1.25,
          borderRadius: 2,
          bgcolor: `${tone}.lighter`,
          color: `${tone}.main`,
        }}
      >
        <Icon fontSize="small" />
      </Box>
    )}
  </Paper>
);

export default StatCard;

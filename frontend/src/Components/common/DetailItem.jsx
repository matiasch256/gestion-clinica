import { Box, Typography } from "@mui/material";

// Par etiqueta / valor de las pantallas de detalle.
const DetailItem = ({ label, value, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" component="div">
      {label}
    </Typography>
    <Typography variant="body1" component="div" sx={{ fontWeight: 500 }}>
      {children ?? (value || value === 0 ? value : "—")}
    </Typography>
  </Box>
);

export default DetailItem;

import { Box, Button, Paper, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

export const ExportButtons = ({ onExcel, onPdf }) => (
  <>
    {onExcel && (
      <Button
        size="small"
        color="inherit"
        startIcon={<DescriptionOutlinedIcon />}
        onClick={onExcel}
      >
        Excel
      </Button>
    )}
    {onPdf && (
      <Button
        size="small"
        color="inherit"
        startIcon={<PictureAsPdfOutlinedIcon />}
        onClick={onPdf}
      >
        PDF
      </Button>
    )}
  </>
);

// Tarjeta que contiene una tabla. La barra superior (cantidad de resultados
// y exportación) queda pegada a la tabla a la que pertenece.
const TableCard = ({ summary, actions, children, sx }) => (
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", ...sx }}>
    {(summary || actions) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          px: 2,
          py: 1,
          minHeight: 52,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, color: "text.secondary" }}>
          {actions}
        </Box>
      </Box>
    )}
    <Box sx={{ overflowX: "auto" }}>{children}</Box>
  </Paper>
);

export default TableCard;

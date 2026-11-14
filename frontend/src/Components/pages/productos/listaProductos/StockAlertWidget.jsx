import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StatusChip from "../../../common/StatusChip";
import { getStockStatus } from "../../../../utils/stock";

const GROUPS = [
  { tone: "success", label: "OK" },
  { tone: "warning", label: "Cerca del mínimo" },
  { tone: "error", label: "Bajo" },
];

// Resumen del estado de stock: tres contadores juntos y, debajo,
// el detalle de los productos en riesgo.
const StockAlertWidget = ({ productos }) => {
  const withStatus = productos.map((producto) => ({
    producto,
    status: getStockStatus(producto.stock, producto.stockMinimo),
  }));
  const enRiesgo = withStatus.filter(({ status }) => status.tone !== "success");

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Estado de stock
        </Typography>
        {GROUPS.map((group) => (
          <StatusChip
            key={group.tone}
            color={group.tone}
            status={`${group.label}: ${
              withStatus.filter(({ status }) => status.tone === group.tone)
                .length
            }`}
            sx={{ textTransform: "none" }}
          />
        ))}
      </Box>
      {enRiesgo.length > 0 && (
        <Accordion
          disableGutters
          elevation={0}
          square
          sx={{ borderTop: 1, borderColor: "divider" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">
              Ver productos en riesgo ({enRiesgo.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List dense disablePadding>
              {enRiesgo.map(({ producto, status }) => (
                <ListItem
                  key={producto.id}
                  disableGutters
                  secondaryAction={
                    <StatusChip color={status.tone} status={status.label} />
                  }
                >
                  <ListItemText
                    primary={producto.nombre}
                    secondary={`Stock: ${producto.stock} · Mínimo: ${producto.stockMinimo}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

export default StockAlertWidget;

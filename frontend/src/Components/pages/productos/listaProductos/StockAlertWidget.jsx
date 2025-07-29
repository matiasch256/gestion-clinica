import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";

const StockAlertWidget = ({ productos, showActionButton = false }) => {
  const navigate = useNavigate();

  // Calcular el estado de cada producto
  const getStockStatus = (stock, stockMinimo) => {
    if (stock <= stockMinimo) {
      return { color: "#d32f2f", label: "Bajo" }; // Rojo
    } else if (stock <= stockMinimo * 1.1) {
      return { color: "#f57c00", label: "Cercano al límite" }; // Naranja
    } else {
      return { color: "#2e7d32", label: "OK" }; // Verde
    }
  };

  // Contar productos por estado
  const stockSummary = productos.reduce(
    (acc, producto) => {
      const status = getStockStatus(producto.stock, producto.stockMinimo);
      if (status.label === "Bajo") acc.rojo++;
      else if (status.label === "Cercano al límite") acc.naranja++;
      else acc.verde++;
      return acc;
    },
    { verde: 0, naranja: 0, rojo: 0 }
  );

  // Filtrar productos en riesgo (naranja y rojo)
  const productosEnRiesgo = productos.filter(
    (producto) =>
      getStockStatus(producto.stock, producto.stockMinimo).label !== "OK"
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Alertas de Stock
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircleIcon sx={{ color: "#2e7d32", fontSize: 16 }} />
          <Typography>OK: {stockSummary.verde}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircleIcon sx={{ color: "#f57c00", fontSize: 16 }} />
          <Typography>Cercano al límite: {stockSummary.naranja}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircleIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
          <Typography>Bajo: {stockSummary.rojo}</Typography>
        </Box>
      </Box>
      {productosEnRiesgo.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Productos en riesgo ({productosEnRiesgo.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {productosEnRiesgo.map((producto) => {
                const status = getStockStatus(
                  producto.stock,
                  producto.stockMinimo
                );
                return (
                  <ListItem
                    key={producto.id}
                    secondaryAction={
                      showActionButton && (
                        <Button
                          variant="outlined"
                          onClick={() =>
                            navigate(`/compras/crear?productoId=${producto.id}`)
                          }
                        >
                          Crear Orden
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={`${producto.nombre} (Stock: ${producto.stock}, Mínimo: ${producto.stockMinimo})`}
                      secondary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircleIcon
                            sx={{ color: status.color, fontSize: 12 }}
                          />
                          <Typography variant="body2">
                            {status.label}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default StockAlertWidget;

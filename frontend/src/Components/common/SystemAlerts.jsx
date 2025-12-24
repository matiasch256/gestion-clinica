import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const SystemAlerts = ({ onNavigate }) => {
  return (
    <Card
      sx={{
        borderLeft: "4px solid #f59e0b",
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#d97706",
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 20 }} />
            <Typography variant="h6">Alertas del Sistema</Typography>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              backgroundColor: "#fef3c7",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="medium" color="#d97706">
                Stock bajo en 3 productos
              </Typography>
              <Typography variant="body2" color="#ca8a04">
                Requiere atención inmediata
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigate("productos", "stock")}
              sx={{
                borderColor: "#ca8a04 !important",
                color: "#ca8a04 !important",
                backgroundColor: "#ffff !important",
                "&:hover": {
                  borderColor: "#ca8a04 !important",
                  backgroundColor: "rgba(202, 138, 4, 0.08) !important",
                },
              }}
            >
              Ver detalles
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              backgroundColor: "#dbeafe",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="medium" color="#1e40af">
                5 órdenes pendientes de aprobación
              </Typography>
              <Typography variant="body2" color="#1e3a8a">
                Esperando revisión
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigate("compras", "ordenes")}
              sx={{
                borderColor: "#1e3a8a !important",
                color: "#1e3a8a !important",
                backgroundColor: "#ffff !important",
                "&:hover": {
                  borderColor: "#1e3a8a !important",
                  backgroundColor: "rgba(30, 58, 138, 0.08) !important",
                },
              }}
            >
              Revisar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;

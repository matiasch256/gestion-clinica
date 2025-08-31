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
        borderLeft: "4px solid #f59e0b", // Amarillo similar a yellow-500
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
            {" "}
            {/* Amarillo oscuro similar a yellow-700 */}
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
              backgroundColor: "#fef3c7", // Amarillo claro similar a yellow-50
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="medium" color="#d97706">
                {" "}
                {/* Amarillo oscuro similar a yellow-800 */}
                Stock bajo en 3 productos
              </Typography>
              <Typography variant="body2" color="#ca8a04">
                {" "}
                {/* Amarillo medio similar a yellow-600 */}
                Requiere atención inmediata
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigate("productos", "stock")}
              sx={{
                // Directamente aplicas los estilos al botón
                borderColor: "#ca8a04 !important", // Borde amarillo/dorado
                color: "#ca8a04 !important", // Texto del mismo color para cohesión
                backgroundColor: "#ffff !important",
                "&:hover": {
                  borderColor: "#ca8a04 !important", // Mantiene el color del borde en hover
                  backgroundColor: "rgba(202, 138, 4, 0.08) !important", // Un fondo suave del mismo color
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
              backgroundColor: "#dbeafe", // Azul claro similar a blue-50
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="medium" color="#1e40af">
                {" "}
                {/* Azul oscuro similar a blue-800 */}5 órdenes pendientes de
                aprobación
              </Typography>
              <Typography variant="body2" color="#1e3a8a">
                {" "}
                {/* Azul medio similar a blue-600 */}
                Esperando revisión
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigate("compras", "ordenes")}
              sx={{
                borderColor: "#1e3a8a !important", // Borde azul
                color: "#1e3a8a !important", // Texto del mismo color para cohesión
                backgroundColor: "#ffff !important",
                "&:hover": {
                  borderColor: "#1e3a8a !important", // Mantiene el color del borde en hover
                  backgroundColor: "rgba(30, 58, 138, 0.08) !important", // Un fondo suave del mismo color
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

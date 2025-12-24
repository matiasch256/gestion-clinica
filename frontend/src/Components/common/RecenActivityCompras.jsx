import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
} from "@mui/material";

const RecentActivityCompras = ({ ordenes, productos }) => {
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "$0.00";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const getStatusChipColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return { bgColor: "#FFF8E1", textColor: "warning.main" };
      case "Aprobada":
        return { bgColor: "#E3F2FD", textColor: "info.main" };
      case "Pedido":
        return { bgColor: "#E8EAF6", textColor: "primary.main" };
      case "Recibida":
      case "Completada":
        return { bgColor: "#E8F5E9", textColor: "success.main" };
      case "Cancelada":
        return { bgColor: "#FFEBEE", textColor: "error.main" };
      default:
        return { bgColor: "#F5F5F5", textColor: "text.primary" };
    }
  };

  return (
    <Grid container spacing={4}>
      {}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card elevation={3} sx={{ height: "100%" }}>
          <CardHeader
            title={<Typography variant="h6">Órdenes Recientes</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {ordenes?.map((orden) => (
                <Box
                  key={orden.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      ORD-{orden.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orden.proveedorNombre}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(orden.total)}
                    </Typography>
                    <Chip
                      label={orden.estado}
                      size="small"
                      sx={{
                        backgroundColor: getStatusChipColor(orden.estado)
                          .bgColor,
                        color: getStatusChipColor(orden.estado).textColor,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card elevation={3} sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Typography variant="h6">Productos con Stock Bajo</Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {productos?.map((producto, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock actual
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body1"
                      color="error.main"
                      fontWeight="medium"
                    >
                      {producto.stock} unidades
                    </Typography>
                    <Chip
                      label="Stock crítico"
                      size="small"
                      sx={{ backgroundColor: "#FFEBEE", color: "error.main" }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RecentActivityCompras;

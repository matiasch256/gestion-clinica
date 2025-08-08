import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InfoCard from "../../../common/InfoCard";

export const ComprasDashboard = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    height: 50,
    borderColor: "#1976d2 !important",
    color: "#1976d2 !important",
    backgroundColor: "transparent !important",
    "&:hover": {
      borderColor: "#115293 !important",
      backgroundColor: "rgba(25, 118, 210, 0.04) !important",
    },
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Dashboard de Compras
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Órdenes Pendientes"
            content="5 órdenes sin aprobar"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Facturas Recientes" content="3 nuevas esta semana" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Stock Crítico"
            content="2 productos debajo del mínimo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Total Comprado (Mes)" content="$248.000" />
        </Grid>
      </Grid>

      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate("/compras/registrar")}
              sx={buttonStyle}
            >
              Registrar Compra
            </Button>
            <Button
              variant="outlined"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate("/compras/lista")}
              sx={buttonStyle}
            >
              Ver Facturas
            </Button>
            <Button
              variant="outlined"
              startIcon={<InventoryIcon />}
              onClick={() => navigate("/stock")} // Ajusta la ruta según tu app
              sx={buttonStyle}
            >
              Consultar Stock
            </Button>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate("/ordenes")} // Ajusta la ruta según tu app
              sx={buttonStyle}
            >
              Emitir Orden
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

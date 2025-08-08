import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InfoCard from "../../../common/InfoCard";
import QuickActionButton from "../../../common/QuickActionButton";

export const ComprasDashboard = () => {
  const navigate = useNavigate();

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
            <QuickActionButton
              icon={<AddIcon />}
              label="Registrar Compra"
              onClick={() => navigate("/compras/registrar")}
            />
            <QuickActionButton
              icon={<ReceiptIcon />}
              label="Ver Facturas"
              onClick={() => navigate("/compras/lista")}
            />

            <QuickActionButton
              icon={<InventoryIcon />}
              label="Consultar Stock"
              onClick={() => navigate("/stock")}
            />
            <QuickActionButton
              icon={<VisibilityIcon />}
              label="Ver Orden"
              onClick={() => navigate("/ordenes")}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

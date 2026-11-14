import { Box, Grid } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardHeader from "../../common/DashboardHeader";
import SystemMetricsGrid from "../../common/SystemMetricsGrid";
import QuickActionsCard from "../../common/QuickActionsCard";
import { quickActionsHome } from "../../common/quickActionsData";
import RecentActivity from "../../common/RecentActivity";
import CategoryDistribution from "../../common/CategoryDistribution";
import SystemAlerts from "../../common/SystemAlerts";
import { useAuth } from "../../../context/authContext";

const METRICS = [
  {
    title: "Órdenes pendientes",
    value: "12",
    caption: "+3 desde ayer",
    icon: ShoppingCartIcon,
    tone: "warning",
  },
  {
    title: "Productos activos",
    value: "1.247",
    caption: "+15 esta semana",
    icon: InventoryIcon,
  },
  {
    title: "Proveedores",
    value: "89",
    caption: "+2 este mes",
    icon: LocalShippingIcon,
  },
  {
    title: "Categorías",
    value: "24",
    caption: "Sin cambios este mes",
    icon: CategoryIcon,
  },
];

const getGreeting = (user) => {
  if (!user?.Nombre) return "Panel de control";
  const saludo =
    user.Genero === "Femenino"
      ? "Bienvenida"
      : user.Genero === "Masculino"
        ? "Bienvenido"
        : "Bienvenido/a";
  return `${saludo}, ${user.Nombre}`;
};

// Composición: métricas arriba en una fila pareja; debajo, dos columnas
// de peso distinto (8/4): lo principal a la izquierda, lo de apoyo a la derecha.
export const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <DashboardHeader title={getGreeting(user)} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SystemMetricsGrid systemMetrics={METRICS} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <QuickActionsCard quickActions={quickActionsHome} />
              <RecentActivity />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <SystemAlerts />
              <CategoryDistribution />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

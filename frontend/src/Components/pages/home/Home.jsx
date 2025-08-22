import DashboardHeader from "../../../components/common/DashboardHeader";
import SystemMetricsGrid from "../../../components/common/SystemMetricsGrid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import QuickActionsCard from "../../../components/common/QuickActionsCard";
import quickActionsData from "../../../components/common/quickActionsData";
import RecentActivity from "../../../components/common/RecentActivity";
import CategoryDistribution from "../../../components/common/CategoryDistribution";
import SystemAlerts from "../../../components/common/SystemAlerts";
import { Grid } from "@mui/material";

export const Home = () => {
  return (
    <>
      <DashboardHeader />
      <SystemMetricsGrid
        systemMetrics={[
          {
            title: "Órdenes Pendientes",
            value: "12",
            trending: "up",
            change: "+3 desde ayer",
            bgColor: "rgba(25, 118, 210, 0.1)",
            color: "#1976d2",
            icon: ShoppingCartIcon,
          },
          {
            title: "Productos Activos",
            value: "1,247",
            trending: "up",
            change: "+15 esta semana",
            bgColor: "rgba(76, 175, 80, 0.1)",
            color: "#4caf50",
            icon: InventoryIcon,
          },
          {
            title: "Proveedores",
            value: "89",
            trending: "up",
            change: "+2 este mes",
            bgColor: "rgba(186, 104, 200, 0.1)",
            color: "#ba68c8",
            icon: PeopleIcon,
          },
          {
            title: "Categorías",
            value: "24",
            trending: null,
            change: "Sin cambios",
            bgColor: "rgba(255, 152, 0, 0.1)",
            color: "#ff9800",
            icon: FolderIcon,
          },
        ]}
      />
      <QuickActionsCard quickActions={quickActionsData} />
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RecentActivity />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <CategoryDistribution />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <SystemAlerts
            onNavigate={(page, section) => console.log(page, section)}
          />
        </Grid>
      </Grid>
    </>
  );
};

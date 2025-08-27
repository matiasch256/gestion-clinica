import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InfoCard from "../../../common/InfoCard";
import QuickActionButton from "../../../common/QuickActionButton";
import DashboardHeader from "../../../common/DashboardHeader";
import SystemMetricsGrid from "../../../common/SystemMetricsGrid";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import QuickActionsCard from "../../../common/QuickActionsCard";
import { quickActionsCompras } from "../../../common/quickActionsData";
import RecentActivityCompras from "../../../common/RecenActivityCompras";
import CategoryDistribution from "../../../common/CategoryDistribution";
import { Grid } from "@mui/material";

export const ComprasDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    <InfoCard title="Órdenes Pendientes" content="5 órdenes sin aprobar" />,
    <InfoCard title="Facturas Recientes" content="3 nuevas esta semana" />,
    <InfoCard title="Stock Crítico" content="2 productos debajo del mínimo" />,
    <InfoCard title="Total Comprado (Mes)" content="$248.000" />,
  ];

  const actions = [
    <QuickActionButton
      icon={<AddIcon />}
      label="Registrar Compra"
      onClick={() => navigate("/compras/registrar")}
    />,
    <QuickActionButton
      icon={<ReceiptIcon />}
      label="Ver Facturas"
      onClick={() => navigate("/compras/lista")}
    />,
    <QuickActionButton
      icon={<InventoryIcon />}
      label="Consultar Stock"
      onClick={() => navigate("/stock")}
    />,
    <QuickActionButton
      icon={<VisibilityIcon />}
      label="Ver Órdenes"
      onClick={() => navigate("/ordenes")}
    />,
  ];

  return (
    <>
      <DashboardHeader />
      <SystemMetricsGrid
        systemMetrics={[
          {
            title: "Órdenes Pendientes",
            value: "5",
            description: "órdenes sin aprobar",
            icon: ShoppingCartOutlinedIcon,
            color: "warning.main",
            bgColor: "#FFF8E1",
          },
          {
            title: "Facturas Recientes",
            value: "3",
            description: "nuevas esta semana",
            icon: ReceiptLongRoundedIcon,
            color: "info.main",
            bgColor: "#E3F2FD",
          },
          {
            title: "Stock Crítico",
            value: "2",
            description: "productos debajo del mínimo",
            icon: ReportProblemOutlinedIcon,
            color: "error.main",
            bgColor: "#FFEBEE",
          },
          {
            title: "Total Comprado (Mes)",
            value: "$248,000",
            description: "monto total del mes",
            icon: AttachMoneyOutlinedIcon,
            color: "success.main",
            bgColor: "#E8F5E9",
          },
        ]}
      />
      <QuickActionsCard quickActions={quickActionsCompras} />
      <Grid container spacing={4} sx={{ mt: 3 }}></Grid>
      <Grid item xs={12} lg={8}>
        <RecentActivityCompras />
      </Grid>
    </>
  );
};

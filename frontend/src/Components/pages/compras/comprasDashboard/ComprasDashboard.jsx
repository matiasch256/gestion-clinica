// ComprasDashboard.js
import { useState, useEffect } from "react"; // <-- Importa hooks
import { useNavigate } from "react-router-dom";
import { Grid, Skeleton } from "@mui/material"; // <-- Importa Skeleton

// ... (importaciones de íconos y otros componentes)
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DashboardHeader from "../../../common/DashboardHeader";
import SystemMetricsGrid from "../../../common/SystemMetricsGrid";
import QuickActionsCard from "../../../common/QuickActionsCard";
import { quickActionsCompras } from "../../../common/quickActionsData";
import RecentActivityCompras from "../../../common/RecenActivityCompras";

export const ComprasDashboard = () => {
  const navigate = useNavigate();

  // 1. Definir estados para los datos y la carga
  const [dashboardData, setDashboardData] = useState({
    ordenesPendientes: 0,
    facturasRecientes: 0,
    stockCritico: 0,
    totalCompradoMes: 0,
  });
  const [loading, setLoading] = useState(true);

  // 2. Usar useEffect para hacer la llamada a la API
  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard/compras-metrics")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos del dashboard:", err);
        setLoading(false); // También detener la carga en caso de error
      });
  }, []); // El array vacío asegura que se ejecute solo una vez

  // Función para formatear el dinero
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  // 3. Renderizado condicional
  if (loading) {
    return (
      <>
        <DashboardHeader />
        {/* Mostramos 4 esqueletos mientras carga */}
        <Grid container spacing={4}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  // 4. Usar los datos del estado en el componente
  return (
    <>
      <DashboardHeader />
      <SystemMetricsGrid
        systemMetrics={[
          {
            title: "Órdenes Pendientes",
            value: dashboardData.ordenesPendientes.toString(),
            description: "órdenes sin aprobar",
            icon: ShoppingCartOutlinedIcon,
            color: "warning.main",
            bgColor: "#FFF8E1",
          },
          {
            title: "Facturas Recientes",
            value: dashboardData.facturasRecientes.toString(),
            description: "nuevas esta semana",
            icon: ReceiptLongRoundedIcon,
            color: "info.main",
            bgColor: "#E3F2FD",
          },
          {
            title: "Stock Crítico",
            value: dashboardData.stockCritico.toString(),
            description: "productos debajo del mínimo",
            icon: ReportProblemOutlinedIcon,
            color: "error.main",
            bgColor: "#FFEBEE",
          },
          {
            title: "Total Comprado (Mes)",
            value: formatCurrency(dashboardData.totalCompradoMes), // <-- Dato dinámico
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

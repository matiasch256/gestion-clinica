import { useState, useEffect } from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DashboardHeader from "../../../common/DashboardHeader";
import SystemMetricsGrid from "../../../common/SystemMetricsGrid";
import QuickActionsCard from "../../../common/QuickActionsCard";
import { quickActionsCompras } from "../../../common/quickActionsData";
import RecentActivityCompras from "./../../../common/RecenActivityCompras";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);

export const ComprasDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    ordenesPendientes: 0,
    facturasRecientes: 0,
    stockCritico: 0,
    totalCompradoMes: 0,
    listaOrdenesRecientes: [],
    listaStockCritico: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard/compras-metrics")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos del dashboard:", err);
        setLoading(false);
      });
  }, []);

  const header = (
    <DashboardHeader
      title="Compras"
      subtitle="Resumen de órdenes, stock y gasto del mes"
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      {header}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SystemMetricsGrid
          systemMetrics={[
            {
              title: "Órdenes pendientes",
              value: String(dashboardData.ordenesPendientes),
              caption: "En estado pendiente",
              icon: ShoppingCartOutlinedIcon,
              tone: "warning",
            },
            {
              title: "Stock crítico",
              value: String(dashboardData.stockCritico),
              caption: "Productos debajo del mínimo",
              icon: ReportProblemOutlinedIcon,
              tone: "error",
            },
            {
              title: "Facturas recientes",
              value: String(dashboardData.facturasRecientes),
              caption: "Nuevas esta semana",
              icon: ReceiptLongRoundedIcon,
            },
            {
              title: "Total comprado (mes)",
              value: formatCurrency(dashboardData.totalCompradoMes),
              caption: "Monto total del mes",
              icon: AttachMoneyOutlinedIcon,
            },
          ]}
        />
        <QuickActionsCard quickActions={quickActionsCompras} />
        <RecentActivityCompras
          ordenes={dashboardData.listaOrdenesRecientes}
          productos={dashboardData.listaStockCritico}
        />
      </Box>
    </>
  );
};

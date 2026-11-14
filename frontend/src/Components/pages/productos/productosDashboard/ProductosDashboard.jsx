import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import PageHeader from "../../../common/PageHeader";
import SectionCard from "../../../common/SectionCard";
import SystemMetricsGrid from "../../../common/SystemMetricsGrid";
import StatusChip from "../../../common/StatusChip";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArchiveIcon from "@mui/icons-material/Archive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LabelIcon from "@mui/icons-material/Label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export function ProductosDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const metricas = {
    totalProductos: 1247,
    stockBajo: 23,
    sinStock: 8,
    valorInventario: 892150,
    productosNuevos: 15,
    productosMasVendidos: 45,
  };

  const productosPorCategoria = [
    { name: "Oficina", value: 324 },
    { name: "Tecnología", value: 256 },
    { name: "Mobiliario", value: 189 },
    { name: "Limpieza", value: 145 },
    { name: "Papelería", value: 167 },
    { name: "Otros", value: 166 },
  ];

  const stockPorMes = [
    { mes: "Ene", entradas: 145, salidas: 98, stock: 1180 },
    { mes: "Feb", entradas: 167, salidas: 134, stock: 1213 },
    { mes: "Mar", entradas: 123, salidas: 156, stock: 1180 },
    { mes: "Abr", entradas: 189, salidas: 145, stock: 1224 },
    { mes: "May", entradas: 156, salidas: 178, stock: 1202 },
    { mes: "Jun", entradas: 178, salidas: 134, stock: 1246 },
  ];

  const productosStockBajo = [
    { nombre: "Papel A4 Resma", stock: 5, minimo: 20, categoria: "Papelería" },
    {
      nombre: "Tóner HP LaserJet",
      stock: 2,
      minimo: 10,
      categoria: "Tecnología",
    },
    {
      nombre: "Sillas Oficina Ejecutiva",
      stock: 3,
      minimo: 8,
      categoria: "Mobiliario",
    },
    {
      nombre: "Detergente Industrial",
      stock: 1,
      minimo: 15,
      categoria: "Limpieza",
    },
  ];

  const productosMasVendidos = [
    { nombre: "Computadora Dell Inspiron", ventas: 34, revenue: 425600 },
    { nombre: "Monitor LG 24''", ventas: 28, revenue: 168000 },
    { nombre: "Impresora HP OfficeJet", ventas: 22, revenue: 132000 },
    { nombre: "Escritorio Ejecutivo", ventas: 18, revenue: 108000 },
    { nombre: "Teléfono IP Cisco", ventas: 15, revenue: 90000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const series = theme.palette.charts.series;

  const metricCards = [
    {
      title: "Total de productos",
      value: metricas.totalProductos.toLocaleString("es-AR"),
      caption: `+${metricas.productosNuevos} este mes`,
      icon: Inventory2Icon,
    },
    {
      title: "Stock bajo",
      value: metricas.stockBajo,
      caption: "Requieren reposición",
      icon: WarningAmberIcon,
      tone: "warning",
    },
    {
      title: "Sin stock",
      value: metricas.sinStock,
      caption: "Productos agotados",
      icon: ArchiveIcon,
      tone: "error",
    },
    {
      title: "Valor del inventario",
      value: formatCurrency(metricas.valorInventario),
      caption: "+12,5% vs. mes anterior",
      icon: AttachMoneyIcon,
    },
    {
      title: "Más vendidos",
      value: metricas.productosMasVendidos,
      caption: "Top de productos activos",
      icon: TrendingUpIcon,
    },
    {
      title: "Categorías",
      value: productosPorCategoria.length,
      caption: "Categorías activas",
      icon: LabelIcon,
    },
  ];

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle="Inventario y rendimiento de los productos"
        actions={
          <>
            <Button
              startIcon={<BarChartIcon />}
              onClick={() => navigate("/reportes/stock")}
            >
              Reportes
            </Button>
            <Button
              variant="outlined"
              startIcon={<InventoryIcon />}
              onClick={() => navigate("/productos/lista")}
            >
              Ver inventario
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/productos/registrar")}
            >
              Agregar producto
            </Button>
          </>
        }
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SystemMetricsGrid systemMetrics={metricCards} />

        <Box>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Secciones del panel de productos"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
          >
            <Tab label="Resumen" id="tab-0" />
            <Tab label="Control de stock" id="tab-1" />
            <Tab label="Más vendidos" id="tab-2" />
          </Tabs>

          <TabPanel value={selectedTab} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <SectionCard
                  title="Productos por categoría"
                  description="Distribución actual del inventario"
                  sx={{ height: "100%" }}
                >
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productosPorCategoria}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {productosPorCategoria.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={series[index % series.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Productos"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      columnGap: 3,
                      rowGap: 1,
                      mt: 2,
                    }}
                  >
                    {productosPorCategoria.map((categoria, index) => (
                      <Box
                        key={categoria.name}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: series[index % series.length],
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {categoria.name}: {categoria.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </SectionCard>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <SectionCard
                  title="Stock bajo"
                  description="Productos que requieren reposición"
                  disablePadding
                  sx={{ height: "100%" }}
                  action={
                    <Button
                      size="small"
                      onClick={() => navigate("/reportes/stock")}
                    >
                      Ver todos
                    </Button>
                  }
                >
                  {productosStockBajo.map((producto, index) => (
                    <Box
                      key={producto.nombre}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        px: 3,
                        py: 1.5,
                        borderTop: index === 0 ? 0 : 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>
                          {producto.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {producto.categoria} · Mínimo: {producto.minimo}
                        </Typography>
                      </Box>
                      <StatusChip
                        color={producto.stock === 0 ? "error" : "warning"}
                        status={`Stock: ${producto.stock}`}
                        sx={{ textTransform: "none" }}
                      />
                    </Box>
                  ))}
                </SectionCard>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <SectionCard
              title="Movimientos de stock"
              description="Entradas y salidas de productos en los últimos 6 meses"
            >
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockPorMes}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                    />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="entradas"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      name="Entradas"
                    />
                    <Line
                      type="monotone"
                      dataKey="salidas"
                      stroke={theme.palette.error.main}
                      strokeWidth={2}
                      name="Salidas"
                    />
                    <Line
                      type="monotone"
                      dataKey="stock"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      name="Stock total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </SectionCard>
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <SectionCard
              title="Productos más vendidos"
              description="Los 5 productos con mejor rendimiento en ventas"
              disablePadding
            >
              {productosMasVendidos.map((producto, index) => (
                <Box
                  key={producto.nombre}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 1.5,
                    borderTop: index === 0 ? 0 : 1,
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: "primary.lighter",
                      color: "primary.main",
                      typography: "subtitle2",
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {producto.ventas} unidades vendidas
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1">
                    {formatCurrency(producto.revenue)}
                  </Typography>
                </Box>
              ))}
            </SectionCard>
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function ProductosDashboard({ onNavigate }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("30"); // Not used in current code, but kept for potential

  // Datos mock para métricas
  const metricas = {
    totalProductos: 1247,
    stockBajo: 23,
    sinStock: 8,
    valorInventario: 892150,
    productosNuevos: 15,
    productosMasVendidos: 45,
  };

  // Datos para gráfico de productos por categoría
  const productosPorCategoria = [
    { name: "Oficina", value: 324, color: "#007bff" },
    { name: "Tecnología", value: 256, color: "#28a745" },
    { name: "Mobiliario", value: 189, color: "#ffc107" },
    { name: "Limpieza", value: 145, color: "#17a2b8" },
    { name: "Papelería", value: 167, color: "#6f42c1" },
    { name: "Otros", value: 166, color: "#fd7e14" },
  ];

  // Datos para gráfico de stock
  const stockPorMes = [
    { mes: "Ene", entradas: 145, salidas: 98, stock: 1180 },
    { mes: "Feb", entradas: 167, salidas: 134, stock: 1213 },
    { mes: "Mar", entradas: 123, salidas: 156, stock: 1180 },
    { mes: "Abr", entradas: 189, salidas: 145, stock: 1224 },
    { mes: "May", entradas: 156, salidas: 178, stock: 1202 },
    { mes: "Jun", entradas: 178, salidas: 134, stock: 1246 },
  ];

  // Productos con stock bajo
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

  // Productos más vendidos
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header con acciones rápidas */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5">Dashboard de Productos</Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            {" "}
            {/* text-muted-foreground */}
            Gestiona tu inventario y monitorea el rendimiento de productos
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            "& .MuiButton-contained": {
              backgroundColor: "#3B82F6",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
            },
            "& .MuiButton-outlined": {
              backgroundColor: "#fff",

              "&:hover": {
                backgroundColor: "#dbeafe",
                borderColor: "#9CA3AF",
                color: "#2563EB",
              },
            },
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onNavigate("productos", "registrar")}
          >
            Agregar Producto
          </Button>
          <Button
            variant="outlined"
            startIcon={<InventoryIcon />}
            sx={{
              borderColor: "#D1D5DB",
              color: "#374151",
              "&:hover": { borderColor: "#9CA3AF" },
            }}
            onClick={() => onNavigate("productos", "lista")}
          >
            Ver Inventario
          </Button>
          <Button
            variant="outlined"
            startIcon={<BarChartIcon />}
            sx={{
              borderColor: "#D1D5DB",
              color: "#374151",
              "&:hover": { borderColor: "#9CA3AF" },
            }}
            onClick={() => onNavigate("productos", "reportes")}
          >
            Reportes
          </Button>
        </Box>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  Total Productos
                </Typography>
                <Typography variant="h6">
                  {metricas.totalProductos.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  <span style={{ color: "#10B981" }}>
                    +{metricas.productosNuevos}
                  </span>{" "}
                  este mes
                </Typography>
              </Box>
              <Inventory2Icon sx={{ color: "#6B7280" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  Stock Bajo
                </Typography>
                <Typography variant="h6" sx={{ color: "#F59E0B" }}>
                  {metricas.stockBajo}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Requieren reposición
                </Typography>
              </Box>
              <WarningAmberIcon sx={{ color: "#F59E0B" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  Sin Stock
                </Typography>
                <Typography variant="h6" sx={{ color: "#EF4444" }}>
                  {metricas.sinStock}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Productos agotados
                </Typography>
              </Box>
              <ArchiveIcon sx={{ color: "#EF4444" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  Valor Inventario
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(metricas.valorInventario)}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  <span style={{ color: "#10B981" }}>+12.5%</span> vs mes
                  anterior
                </Typography>
              </Box>
              <AttachMoneyIcon sx={{ color: "#6B7280" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  Más Vendidos
                </Typography>
                <Typography variant="h6">
                  {metricas.productosMasVendidos}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Top productos activos
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ color: "#10B981" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  Categorías
                </Typography>
                <Typography variant="h6">
                  {productosPorCategoria.length}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  Categorías activas
                </Typography>
              </Box>
              <LabelIcon sx={{ color: "#6B7280" }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contenido principal con tabs */}
      <Box sx={{ pb: 2 }} size="100%">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            width: "fit-content",
            padding: "3px",
            borderRadius: 12,

            bgcolor: "#F8F9FA",

            color: "#6B7280",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            sx={{
              display: "flex",
              alignItems: "center",

              height: 36, // h-9
              width: "fit-content", // w-fit
              borderRadius: 12, // rounded-xl
              padding: 3,
              "& .MuiTabs-flexContainer": {
                gap: 2,
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab
              label="Resumen"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6, // 1.5 * 4px
                height: 20,
                minHeight: "unset",
                borderRadius: 12,
                border: "1px solid transparent",
                px: 2,
                py: 1,
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
                transition: "color 0.2s, box-shadow 0.2s",
                margin: "auto 0",
                "&:focus-visible": {
                  borderColor: "#3B82F6",
                  boxShadow: `0 0 0 3px #3B82F650`,
                  outline: "1px solid",
                },

                color: "#374151",
                bgcolor: "#F8F9FA !important",

                "&.Mui-selected": {
                  color: "#3B82F6",
                  bgcolor: "#FFFFFF !important",
                },
                "&:hover": {
                  bgcolor: "#FFFFFF !important",
                },
              }}
            />
            <Tab
              label="Control de Stock"
              sx={{
                display: "inline-flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 6 / 4, // 1.5 → 6px
                height: 20,
                minHeight: "unset",
                borderRadius: 12,
                border: "1px solid transparent",
                px: 2,
                py: 1,
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
                textTransform: "none",
                color: "#374151",
                margin: "auto 0",
                bgcolor: "#F8F9FA !important",

                "&.Mui-selected": {
                  color: "#3B82F6",
                  bgcolor: "#FFFFFF !important",
                },
                "&:hover": {
                  bgcolor: "#FFFFFF !important",
                },
              }}
            />
            <Tab
              label="Más Vendidos"
              sx={{
                display: "inline-flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 6 / 4, // 1.5 → 6px
                height: 20,
                minHeight: "unset",
                borderRadius: 12,
                border: "1px solid transparent",
                px: 2,
                py: 1.2,
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
                textTransform: "none",
                color: "#374151",
                margin: "auto 0",
                bgcolor: "#F8F9FA !important",

                "&.Mui-selected": {
                  color: "#3B82F6",
                  bgcolor: "#FFFFFF !important",
                },
                "&:hover": {
                  bgcolor: "#FFFFFF !important",
                },
              }}
            />
          </Tabs>
        </Box>
        {/* Distribución por categorías */}
        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Productos por Categoría</Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Distribución actual del inventario
                  </Typography>
                  <Box sx={{ height: 320, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productosPorCategoria}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {productosPorCategoria.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Productos"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    {productosPorCategoria.map((categoria, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              height: 12,
                              width: 12,
                              borderRadius: "50%",
                              backgroundColor: categoria.color,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            {categoria.name}: {categoria.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Productos con stock bajo */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningAmberIcon sx={{ color: "#F59E0B" }} />
                    <Typography variant="h6">Stock Bajo</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Productos que requieren reposición urgente
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {productosStockBajo.map((producto, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          p: 2,
                          border: "1px solid",
                          borderColor: "#E5E7EB",
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            {producto.nombre}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6B7280" }}>
                            {producto.categoria}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Chip
                            label={`Stock: ${producto.stock}`}
                            color={producto.stock === 0 ? "error" : "default"}
                            variant="outlined"
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#6B7280", display: "block", mt: 0.5 }}
                          >
                            Mín: {producto.minimo}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 2,
                      borderColor: "#D1D5DB",
                      color: "#374151",
                      "&:hover": { borderColor: "#9CA3AF" },
                    }}
                    onClick={() => onNavigate("productos", "stock-bajo")}
                  >
                    Ver Todos los Productos con Stock Bajo
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6">Movimientos de Stock</Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Entradas y salidas de productos en los últimos 6 meses
              </Typography>
              <Box sx={{ height: 320, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="entradas"
                      stroke="#28a745"
                      strokeWidth={2}
                      name="Entradas"
                    />
                    <Line
                      type="monotone"
                      dataKey="salidas"
                      stroke="#dc3545"
                      strokeWidth={2}
                      name="Salidas"
                    />
                    <Line
                      type="monotone"
                      dataKey="stock"
                      stroke="#007bff"
                      strokeWidth={2}
                      name="Stock Total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6">Productos Más Vendidos</Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Top 5 productos con mejor rendimiento en ventas
              </Typography>
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {productosMasVendidos.map((producto, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      border: "1px solid",
                      borderColor: "#E5E7EB",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 40,
                          width: 40,
                          borderRadius: "50%",
                          bgcolor: "#EFF6FF",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#3B82F6" }}
                        >
                          #{index + 1}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1">
                          {producto.nombre}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                          {producto.ventas} unidades vendidas
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle1">
                        {formatCurrency(producto.revenue)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        Revenue
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
    </Box>
  );
}

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WarningIcon from "@mui/icons-material/Warning";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const KpiCard = ({ title, value, icon, color = "text.primary" }) => (
  <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
    <CardContent sx={{ textAlign: "center", py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {icon}
      </Box>
      <Typography
        variant="h4"
        component="p"
        sx={{ fontWeight: "bold", mb: 1, color: color }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="bold">
        {title.toUpperCase()}
      </Typography>
    </CardContent>
  </Card>
);

const currencyFormatter = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

export const ReporteStockCategoria = () => {
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportDate, setReportDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/reportes/stock-por-categoria`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos del reporte");
      }
      const result = await response.json();
      setSummary(result.summary);
      setDetails(result.details);
      setReportDate(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportExcel = () => {
    const headers = [
      "Categoría",
      "Cantidad Total (Unidades)",
      "Valor Total Estimado",
    ];
    const body = details.map((item) => ({
      Categoria: item.CategoriaNombre,
      Cantidad: item.CantidadTotal,
      Valor: item.ValorTotal,
    }));

    const ws = utils.json_to_sheet([headers, ...body], { skipHeader: true });
    ws["!cols"] = [{ wch: 30 }, { wch: 25 }, { wch: 25 }];
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Stock por Categoría");
    writeFile(
      wb,
      `ReporteStockCategoria_${reportDate.toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte: Stock por Categoría", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generado el: ${reportDate.toLocaleString("es-AR")}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Categoría", "Cantidad Total", "Valor Estimado"]],
      body: details.map((item) => [
        item.CategoriaNombre,
        item.CantidadTotal,
        currencyFormatter(item.ValorTotal),
      ]),
      theme: "grid",
      headStyles: { fillColor: [66, 66, 66] },
    });
    doc.save(
      `ReporteStockCategoria_${reportDate.toISOString().split("T")[0]}.pdf`
    );
  };

  const totalInventarioValorizado = details.reduce(
    (acc, item) => acc + item.ValorTotal,
    0
  );

  const pieData = details.map((item, index) => ({
    id: index,
    value: item.ValorTotal,
    label: item.CategoriaNombre,
  }));

  const renderContent = () => {
    if (loading) {
      return (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={500}
          sx={{ borderRadius: 2 }}
        />
      );
    }

    if (error) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#fff4f4",
            border: "1px solid #ffcdd2",
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Error al cargar el reporte
          </Typography>
          <Typography variant="body2">{error}</Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ mt: 2 }}
            color="error"
          >
            Reintentar
          </Button>
        </Paper>
      );
    }

    if (!summary || !details || details.length === 0) {
      return (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography>No se encontraron datos de productos.</Typography>
        </Paper>
      );
    }

    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              title="Valor Total Inventario"
              value={currencyFormatter(totalInventarioValorizado)}
              icon={
                <MonetizationOnIcon color="success" sx={{ fontSize: 40 }} />
              }
              color="success.main"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              title="Stock Total (Unidades)"
              value={summary.StockTotal?.toLocaleString("es-AR")}
              icon={<InventoryIcon color="primary" sx={{ fontSize: 40 }} />}
              color="primary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              title="Categorías Activas"
              value={summary.TotalCategorias}
              icon={<CategoryIcon color="action" sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Distribución por Valor
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {pieData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        innerRadius: 60,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        arcLabel: (item) => {
                          if (totalInventarioValorizado === 0) return "0%";
                          const percent =
                            (item.value / totalInventarioValorizado) * 100;
                          return percent > 5 ? `${percent.toFixed(0)}%` : "";
                        },
                      },
                    ]}
                    width={300}
                    height={300}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        padding: 0,
                      },
                    }}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      },
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Datos insuficientes para el gráfico
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={3}
              sx={{ height: "100%", borderRadius: 2, overflow: "hidden" }}
            >
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Categoría
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Cantidad Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Valor Estimado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details.map((item) => (
                      <TableRow key={item.CategoriaNombre} hover>
                        <TableCell component="th" scope="row">
                          {item.CategoriaNombre}
                        </TableCell>
                        <TableCell align="right">
                          {item.CantidadTotal.toLocaleString("es-AR")} u.
                        </TableCell>
                        <TableCell align="right">
                          {currencyFormatter(item.ValorTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: "100%", margin: "0 auto" }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Reporte: Stock por Categoría
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generado el: {reportDate.toLocaleString("es-AR")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Actualizar Datos">
              <IconButton
                onClick={fetchData}
                color="primary"
                disabled={loading}
                sx={{
                  bgcolor: (theme) => theme.palette.background.transparent,
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              size="small"
              startIcon={<AssessmentIcon />}
              onClick={handleExportExcel}
              disabled={loading || !details || details.length === 0}
              color="success"
            >
              Excel
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              disabled={loading || !details || details.length === 0}
              color="error"
            >
              PDF
            </Button>
          </Box>
        </Box>
      </Paper>

      {renderContent()}
    </Box>
  );
};

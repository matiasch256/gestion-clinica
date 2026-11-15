import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Skeleton,
  Grid,
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
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import TableCard, { ExportButtons } from "../../common/TableCard";
import StatCard from "../../common/StatCard";
import EmptyState from "../../common/EmptyState";
import { countLabel } from "../../../utils/tableLabels";

const currencyFormatter = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

export const ReporteStockCategoria = () => {
  const theme = useTheme();
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

  const hasData = Boolean(summary) && details?.length > 0;

  const totalInventarioValorizado = (details || []).reduce(
    (acc, item) => acc + item.ValorTotal,
    0
  );

  const pieData = (details || []).map((item, index) => ({
    id: index,
    value: item.ValorTotal,
    label: item.CategoriaNombre,
  }));

  const renderContent = () => {
    if (loading) {
      return <Skeleton variant="rounded" width="100%" height={500} />;
    }

    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    if (!hasData) {
      return (
        <SectionCard>
          <EmptyState title="No se encontraron datos de productos" />
        </SectionCard>
      );
    }

    return (
      <>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Valor total del inventario"
              value={totalInventarioValorizado.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
              })}
              icon={MonetizationOnIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Stock total (unidades)"
              value={summary.StockTotal?.toLocaleString("es-AR")}
              icon={InventoryIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Categorías activas"
              value={summary.TotalCategorias}
              icon={CategoryIcon}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <SectionCard title="Distribución por valor" sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <PieChart
                  colors={theme.palette.charts.series}
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
                      direction: "horizontal",
                      position: { vertical: "bottom", horizontal: "center" },
                    },
                  }}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: theme.palette.common.white,
                      fontSize: 12,
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <TableCard
              summary={countLabel(details.length, "categoría", "categorías")}
              actions={
                <ExportButtons
                  onExcel={handleExportExcel}
                  onPdf={handleExportPDF}
                />
              }
              sx={{ height: "100%" }}
            >
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Cantidad total</TableCell>
                      <TableCell align="right">Valor estimado</TableCell>
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
            </TableCard>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Box>
      <PageHeader
        title="Stock por categoría"
        subtitle={`Generado el: ${reportDate.toLocaleString("es-AR")}`}
        actions={
          <Tooltip title="Actualizar">
            <span>
              <IconButton
                onClick={fetchData}
                disabled={loading}
                aria-label="Actualizar"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        }
      />

      {renderContent()}
    </Box>
  );
};

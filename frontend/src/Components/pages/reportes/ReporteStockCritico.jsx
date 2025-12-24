import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningIcon from "@mui/icons-material/Warning";

import { BarChart } from "@mui/x-charts/BarChart";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ReporteStockCritico = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportDate, setReportDate] = useState(new Date());
  const [topN, setTopN] = useState(5);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/reportes/stock-critico?topN=${topN}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos del reporte.");
      }
      const result = await response.json();
      setData(result);
      setReportDate(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportExcel = () => {
    const headers = [
      "Producto",
      "Déficit (Unidades)",
      "Stock Actual",
      "Stock Mínimo",
    ];
    const body = data.map((item) => ({
      Producto: item.nombre,
      Déficit: item.Deficit,
      StockActual: item.stockActual,
      StockMinimo: item.stockMinimo,
    }));

    const ws = utils.json_to_sheet([headers, ...body], { skipHeader: true });
    ws["!cols"] = [{ wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Déficit de Stock");
    writeFile(
      wb,
      `ReporteDéficitStock_${reportDate.toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte Táctico: Déficit de Stock", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generado el: ${reportDate.toLocaleString("es-AR")}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [
        ["Producto", "Déficit (Unidades)", "Stock Actual", "Stock Mínimo"],
      ],
      body: data.map((item) => [
        item.nombre,
        item.Deficit,
        item.stockActual,
        item.stockMinimo,
      ]),
      theme: "grid",
      headStyles: { fillColor: [211, 47, 47] },
    });

    doc.save(
      `ReporteDéficitStock_${reportDate.toISOString().split("T")[0]}.pdf`
    );
  };

  const quantityFormatter = (value) => `${value} u.`;

  const renderContent = () => {
    if (loading) {
      return (
        <Box>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      );
    }

    if (error) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            bgcolor: "#fff4f4",
            border: "1px solid #ffcdd2",
          }}
        >
          <WarningIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h6" color="error">
            No se pudo generar el reporte
          </Typography>
          <Typography variant="body2">{error}</Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            variant="outlined"
            color="error"
          >
            Reintentar
          </Button>
        </Paper>
      );
    }

    if (data.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            border: "1px dashed #ccc",
            bgcolor: "#fafafa",
          }}
        >
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 80, opacity: 0.8 }}
          />
          <Typography variant="h5" fontWeight="bold" color="success.main">
            ¡Todo en orden!
          </Typography>
          <Typography color="text.secondary">
            No se encontraron productos con stock crítico en este momento.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <WarningIcon color="error" /> Visualización de Déficit
        </Typography>
        <BarChart
          height={400}
          xAxis={[
            {
              data: data.map((item) => item.nombre),
              scaleType: "band",
              label: "Producto",
            },
          ]}
          series={[
            {
              data: data.map((item) => item.Deficit),
              label: "Déficit (Unidades Faltantes)",
              valueFormatter: quantityFormatter,
              color: "#d32f2f",
            },
          ]}
          yAxis={[{ label: "Cantidad a Reponer" }]}
          margin={{ top: 20, bottom: 70, left: 70, right: 20 }}
          slotProps={{ legend: { hidden: false } }}
        />
      </Paper>
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
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Reporte Táctico: Stock Crítico
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
              disabled={loading || data.length === 0}
              color="success"
            >
              Excel
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              disabled={loading || data.length === 0}
              color="error"
            >
              PDF
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Mostrar Top</InputLabel>
              <Select
                value={topN}
                onChange={(e) => setTopN(e.target.value)}
                label="Mostrar Top"
              >
                <MenuItem value={5}>Top 5 Críticos</MenuItem>
                <MenuItem value={10}>Top 10 Críticos</MenuItem>
                <MenuItem value={15}>Top 15 Críticos</MenuItem>
                <MenuItem value={100}>Ver Todos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {renderContent()}
    </Box>
  );
};

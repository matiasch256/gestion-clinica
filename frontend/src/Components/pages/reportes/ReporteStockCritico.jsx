import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { BarChart } from "@mui/x-charts/BarChart";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import EmptyState from "../../common/EmptyState";
import { ExportButtons } from "../../common/TableCard";

export const ReporteStockCritico = () => {
  const theme = useTheme();
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
      return <Skeleton variant="rounded" width="100%" height={400} />;
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

    if (data.length === 0) {
      return (
        <EmptyState
          icon={CheckCircleOutlineIcon}
          title="Todo en orden"
          description="No hay productos con stock crítico en este momento."
        />
      );
    }

    return (
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
            label: "Déficit (unidades faltantes)",
            valueFormatter: quantityFormatter,
            color: theme.palette.error.main,
          },
        ]}
        yAxis={[{ label: "Cantidad a reponer" }]}
        margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
      />
    );
  };

  return (
    <Box>
      <PageHeader
        title="Stock crítico"
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

      <SectionCard
        title="Déficit por producto"
        description="Unidades que faltan para llegar al stock mínimo"
        action={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: 1,
              color: "text.secondary",
            }}
          >
            {!loading && data.length > 0 && (
              <ExportButtons
                onExcel={handleExportExcel}
                onPdf={handleExportPDF}
              />
            )}
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Mostrar</InputLabel>
              <Select
                value={topN}
                onChange={(e) => setTopN(e.target.value)}
                label="Mostrar"
              >
                <MenuItem value={5}>Top 5 críticos</MenuItem>
                <MenuItem value={10}>Top 10 críticos</MenuItem>
                <MenuItem value={15}>Top 15 críticos</MenuItem>
                <MenuItem value={100}>Ver todos</MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
      >
        {renderContent()}
      </SectionCard>
    </Box>
  );
};

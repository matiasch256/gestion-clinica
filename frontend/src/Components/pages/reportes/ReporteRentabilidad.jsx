import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Grid,
  Paper,
} from "@mui/material";

import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import EmptyState from "../../common/EmptyState";

export const ReporteRentabilidad = () => {
  const theme = useTheme();
  const [periodo, setPeriodo] = useState("anual");
  const [startYear, setStartYear] = useState("2024");
  const [endYear, setEndYear] = useState("2025");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  const years = ["2022", "2023", "2024", "2025"];

  useEffect(() => {
    if (parseInt(endYear) < parseInt(startYear)) {
      setEndYear(startYear);
    }
    if (parseInt(startYear) > parseInt(endYear)) {
      setStartYear(endYear);
    }
  }, [startYear, endYear]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      periodo,
      startYear,
      endYear,
    });

    fetch(
      `http://localhost:3000/api/reportes/rentabilidad?${params.toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos de rentabilidad:", err);
        setLoading(false);
      });
  }, [periodo, startYear, endYear]);

  const currencyFormatter = (value) =>
    value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const labels = data.map((d) => d.periodo);

  // Verde = ingresos, rojo = costos, azul = utilidad.
  const series = [
    {
      data: data.map((d) => d.ingresos),
      label: "Ingresos (ARS)",
      color: theme.palette.success.main,
    },
    {
      data: data.map((d) => d.costos),
      label: "Costos (ARS)",
      color: theme.palette.error.main,
    },
    {
      data: data.map((d) => d.utilidad),
      label: "Utilidad (ARS)",
      color: theme.palette.primary.main,
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Rentabilidad"
        subtitle="Ingresos, costos y utilidad por período"
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                label="Período"
              >
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
                <MenuItem value="anual">Anual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Año inicial</InputLabel>
              <Select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                label="Año inicial"
              >
                {years
                  .filter((y) => parseInt(y) <= parseInt(endYear))
                  .map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Año final</InputLabel>
              <Select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                label="Año final"
              >
                {years
                  .filter((y) => parseInt(y) >= parseInt(startYear))
                  .map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de gráfico</InputLabel>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                label="Tipo de gráfico"
              >
                <MenuItem value="bar">Barras</MenuItem>
                <MenuItem value="line">Líneas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <SectionCard title="Ingresos vs. costos">
        {loading ? (
          <Skeleton variant="rounded" width="100%" height={400} />
        ) : data.length === 0 ? (
          <EmptyState title="No se registran movimientos en este período" />
        ) : chartType === "bar" ? (
          <BarChart
            height={400}
            xAxis={[{ data: labels, scaleType: "band" }]}
            yAxis={[{ valueFormatter: currencyFormatter, width: 110 }]}
            series={series}
          />
        ) : (
          <LineChart
            height={400}
            xAxis={[{ data: labels, scaleType: "band" }]}
            yAxis={[{ valueFormatter: currencyFormatter, width: 110 }]}
            series={series.map((s) => ({ ...s, area: true, showMark: false }))}
          />
        )}
      </SectionCard>
    </Box>
  );
};

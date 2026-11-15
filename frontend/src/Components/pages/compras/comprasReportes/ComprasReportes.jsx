import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Grid,
} from "@mui/material";

import PageHeader from "../../../common/PageHeader";
import SectionCard from "../../../common/SectionCard";
import EmptyState from "../../../common/EmptyState";

const currencyFormatter = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const quantityFormatter = (value) =>
  value.toLocaleString("es-AR", { style: "decimal" });

// Selector con el mismo ancho y aspecto en los dos reportes.
const FilterSelect = ({ label, value, onChange, children }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {children}
      </Select>
    </FormControl>
  </Grid>
);

// Dibuja la misma serie como barras, torta o líneas.
const SeriesChart = ({ type, labels, values, seriesLabel, formatter }) => {
  const theme = useTheme();
  const axisSx = { "& .MuiChartsAxis-label": { fontSize: "0.8rem" } };

  if (type === "pie") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <PieChart
          colors={theme.palette.charts.series}
          series={[
            {
              data: labels.map((label, index) => ({
                id: index,
                value: values[index] || 0,
                label,
              })),
              arcLabel: (item) => formatter(item.value),
              arcLabelMinAngle: 35,
              arcLabelRadius: "60%",
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: theme.palette.common.white,
              fontWeight: 600,
            },
          }}
          width={500}
          height={300}
        />
      </Box>
    );
  }

  const Chart = type === "line" ? LineChart : BarChart;
  return (
    <Chart
      height={300}
      series={[
        {
          data: values,
          label: seriesLabel,
          color: theme.palette.primary.main,
          ...(type === "line" && { area: true }),
        },
      ]}
      xAxis={[{ data: labels, scaleType: "band" }]}
      yAxis={[{ valueFormatter: formatter, width: 110 }]}
      sx={axisSx}
    />
  );
};

const ComprasReportes = () => {
  const [periodo, setPeriodo] = useState("anual");
  const [startYear, setStartYear] = useState("2022");
  const [endYear, setEndYear] = useState("2025");
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  const [productLabels, setProductLabels] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productChartType, setProductChartType] = useState("bar");
  const [topN, setTopN] = useState(5);
  const [productPeriod, setProductPeriod] = useState("anual");

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
    fetch(
      `http://localhost:3000/api/gastos?periodo=${periodo}&startYear=${startYear}&endYear=${endYear}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedLabels = data.map((item) => {
          if (periodo === "mensual") {
            const [year, month] = item.periodo.split("-");
            const date = new Date(year, month - 1);
            return date.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "numeric",
            });
          }
          return item.periodo;
        });
        setLabels(formattedLabels);
        setValues(data.map((item) => item.total_gastado));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos de gastos:", err);
        setLoading(false);
      });
  }, [periodo, startYear, endYear]);

  useEffect(() => {
    setProductLoading(true);
    setProductLabels([]);
    setProductValues([]);
    fetch(
      `http://localhost:3000/api/compras/cantidad-compras?topN=${topN}&periodo=${productPeriod}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProductLabels(data.map((item) => item.NombreProducto));
        setProductValues(data.map((item) => item.TotalCantidad));
        setProductLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos de productos:", err);
        setProductLoading(false);
      });
  }, [topN, productPeriod]);

  const chartTypeOptions = [
    <MenuItem key="bar" value="bar">
      Barras
    </MenuItem>,
    <MenuItem key="pie" value="pie">
      Torta
    </MenuItem>,
    <MenuItem key="line" value="line">
      Líneas
    </MenuItem>,
  ];

  return (
    <Box>
      <PageHeader
        title="Reportes de compras"
        subtitle="Gastos en insumos y productos más comprados"
      />

      <SectionCard title="Gastos de compras por período" sx={{ mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <FilterSelect label="Período" value={periodo} onChange={setPeriodo}>
            <MenuItem value="mensual">Mensual</MenuItem>
            <MenuItem value="trimestral">Trimestral</MenuItem>
            <MenuItem value="anual">Anual</MenuItem>
          </FilterSelect>
          <FilterSelect
            label="Año inicial"
            value={startYear}
            onChange={setStartYear}
          >
            {years
              .filter((year) => parseInt(year) <= parseInt(endYear))
              .map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
          </FilterSelect>
          <FilterSelect label="Año final" value={endYear} onChange={setEndYear}>
            {years
              .filter((year) => parseInt(year) >= parseInt(startYear))
              .map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
          </FilterSelect>
          <FilterSelect
            label="Tipo de gráfico"
            value={chartType}
            onChange={setChartType}
          >
            {chartTypeOptions}
          </FilterSelect>
        </Grid>

        {loading ? (
          <Skeleton variant="rounded" width="100%" height={300} />
        ) : values.length === 0 ? (
          <EmptyState title="No hay gastos registrados en este período" />
        ) : (
          <SeriesChart
            type={chartType}
            labels={labels}
            values={values}
            seriesLabel="Gastos (ARS)"
            formatter={currencyFormatter}
          />
        )}
      </SectionCard>

      <SectionCard title="Productos más comprados">
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <FilterSelect
            label="Período"
            value={productPeriod}
            onChange={setProductPeriod}
          >
            <MenuItem value="mensual">Último mes</MenuItem>
            <MenuItem value="trimestral">Último trimestre</MenuItem>
            <MenuItem value="semestral">Último semestre</MenuItem>
            <MenuItem value="anual">Último año</MenuItem>
          </FilterSelect>
          <FilterSelect label="Cantidad" value={topN} onChange={setTopN}>
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
          </FilterSelect>
          <FilterSelect
            label="Tipo de gráfico"
            value={productChartType}
            onChange={setProductChartType}
          >
            {chartTypeOptions}
          </FilterSelect>
        </Grid>

        {productLoading ? (
          <Skeleton variant="rounded" width="100%" height={300} />
        ) : productValues.length === 0 ? (
          <EmptyState title="No hay compras registradas en este período" />
        ) : (
          <SeriesChart
            key={`${productChartType}-${topN}-${productPeriod}`}
            type={productChartType}
            labels={productLabels}
            values={productValues}
            seriesLabel="Cantidad comprada"
            formatter={quantityFormatter}
          />
        )}
      </SectionCard>
    </Box>
  );
};

export default ComprasReportes;

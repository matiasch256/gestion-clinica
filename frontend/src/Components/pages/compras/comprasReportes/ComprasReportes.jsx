import { useEffect, useState, useRef } from "react";
// componentes de gráficos
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const ComprasReportes = () => {
  // Estados para el primer contenedor (gastos)
  const [periodo, setPeriodo] = useState("anual");
  const [startYear, setStartYear] = useState("2022");
  const [endYear, setEndYear] = useState("2025");
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  // Estados para el segundo contenedor (productos más comprados)
  const [productLabels, setProductLabels] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productChartType, setProductChartType] = useState("bar");
  const [topN, setTopN] = useState(5);
  const [productPeriod, setProductPeriod] = useState("anual");

  // Referencia para el segundo contenedor
  const secondContainerRef = useRef(null);

  const years = ["2022", "2023", "2024", "2025"];

  // Validación de años
  useEffect(() => {
    if (parseInt(endYear) < parseInt(startYear)) {
      setEndYear(startYear);
    }
    if (parseInt(startYear) > parseInt(endYear)) {
      setStartYear(endYear);
    }
  }, [startYear, endYear]);

  // Carga de datos para gastos (primer contenedor)
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
          } else if (periodo === "trimestral") {
            return item.periodo;
          } else {
            return item.periodo;
          }
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

  // Carga de datos para productos más comprados (segundo contenedor)
  useEffect(() => {
    setProductLoading(true);
    setProductLabels([]);
    setProductValues([]);
    fetch(
      `http://localhost:3000/api/cantidad-compras?topN=${topN}&periodo=${productPeriod}`
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

  // Mantener el scroll en el segundo contenedor al cambiar topN o productPeriod
  useEffect(() => {
    if (secondContainerRef.current) {
      secondContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [topN, productPeriod]);

  // Formateador de valores para cantidades (sin moneda)
  const quantityFormatter = (value) =>
    value.toLocaleString("es-AR", { style: "decimal" });

  // Preparación de datos para el gráfico de torta (segundo contenedor)
  const productPieData = productLabels.map((label, index) => ({
    id: index,
    value: productValues[index] || 0,
    label: label,
  }));

  return (
    <>
      {/* Primer contenedor: Reporte de Gastos */}
      <Container maxWidth="xl">
        <Grid container spacing={5} my={5}>
          <Grid size={12}>
            <Paper elevation={4}>
              <Box sx={{ p: 2 }}>
                {loading ? (
                  <>
                    <Skeleton
                      variant="text"
                      width={300}
                      height={40}
                      sx={{ mb: 5 }}
                    />
                    <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={56}
                        sx={{ mr: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={56}
                        sx={{ mr: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={56}
                        sx={{ mr: 2 }}
                      />
                      <Skeleton variant="rectangular" width={120} height={56} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom mb={5}>
                      Reporte de Gastos de compras de insumos por período
                    </Typography>
                    <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
                      <FormControl sx={{ minWidth: 120, mr: 2 }}>
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
                      <FormControl sx={{ minWidth: 120, mr: 2 }}>
                        <InputLabel>Año Inicial</InputLabel>
                        <Select
                          value={startYear}
                          onChange={(e) => setStartYear(e.target.value)}
                          label="Año Inicial"
                        >
                          {years
                            .filter(
                              (year) => parseInt(year) <= parseInt(endYear)
                            )
                            .map((year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120, mr: 2 }}>
                        <InputLabel>Año Final</InputLabel>
                        <Select
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                          label="Año Final"
                        >
                          {years
                            .filter(
                              (year) => parseInt(year) >= parseInt(startYear)
                            )
                            .map((year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Tipo de Gráfico</InputLabel>
                        <Select
                          value={chartType}
                          onChange={(e) => setChartType(e.target.value)}
                          label="Tipo de Gráfico"
                        >
                          <MenuItem value="bar">Barras</MenuItem>
                          <MenuItem value="pie">Torta</MenuItem>
                          <MenuItem value="line">Líneas</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    {chartType === "bar" ? (
                      <BarChart
                        height={300}
                        series={[
                          {
                            data: values,
                            label: "Gastos (ARS)",
                            id: "gastosId",
                          },
                        ]}
                        xAxis={[{ data: labels, scaleType: "band" }]}
                        yAxis={[
                          { width: 80 },
                          {
                            valueFormatter: (value) =>
                              value.toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              }),
                          },
                        ]}
                        colors={["#1976d2"]}
                        sx={{
                          "& .MuiChartsAxis-label": { fontSize: "0.8rem" },
                        }}
                      />
                    ) : chartType === "pie" ? (
                      <PieChart
                        series={[
                          {
                            data: labels.map((label, index) => ({
                              id: index,
                              value: values[index] || 0,
                              label: label,
                            })),
                            arcLabel: (item) =>
                              item.value.toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              }),
                            arcLabelMinAngle: 35,
                            arcLabelRadius: "60%",
                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fontWeight: "bold",
                          },
                        }}
                        width={500}
                        height={300}
                      />
                    ) : (
                      <LineChart
                        height={300}
                        series={[
                          {
                            data: values,
                            label: "Gastos (ARS)",
                            area: true,
                            color: "#1976d2",
                          },
                        ]}
                        xAxis={[{ data: labels, scaleType: "band" }]}
                        yAxis={[
                          {
                            valueFormatter: (value) =>
                              value.toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              }),
                          },
                        ]}
                        sx={{
                          "& .MuiChartsAxis-label": { fontSize: "0.8rem" },
                        }}
                      />
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Segundo contenedor: Reporte de Productos más comprados */}
      <Container maxWidth="xl" ref={secondContainerRef}>
        <Grid container spacing={5} my={5}>
          <Grid size={12}>
            <Paper elevation={4}>
              <Box sx={{ p: 2 }}>
                {productLoading ? (
                  <>
                    <Skeleton
                      variant="text"
                      width={300}
                      height={40}
                      sx={{ mb: 5 }}
                    />
                    <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={56}
                        sx={{ mr: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={56}
                        sx={{ mr: 2 }}
                      />
                      <Skeleton variant="rectangular" width={120} height={56} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom mb={5}>
                      Reporte de Productos más comprados por período
                    </Typography>
                    <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
                      <FormControl sx={{ minWidth: 120, mr: 2 }}>
                        <InputLabel>Período</InputLabel>
                        <Select
                          value={productPeriod}
                          onChange={(e) => setProductPeriod(e.target.value)}
                          label="Período"
                        >
                          <MenuItem value="mensual">Último Mes</MenuItem>
                          <MenuItem value="trimestral">
                            Último Trimestre
                          </MenuItem>
                          <MenuItem value="semestral">Último Semestre</MenuItem>
                          <MenuItem value="anual">Último Año</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120, mr: 2 }}>
                        <InputLabel>Top N</InputLabel>
                        <Select
                          value={topN}
                          onChange={(e) => setTopN(e.target.value)}
                          label="Top N"
                        >
                          <MenuItem value={5}>Top 5</MenuItem>
                          <MenuItem value={10}>Top 10</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Tipo de Gráfico</InputLabel>
                        <Select
                          value={productChartType}
                          onChange={(e) => setProductChartType(e.target.value)}
                          label="Tipo de Gráfico"
                        >
                          <MenuItem value="bar">Barras</MenuItem>
                          <MenuItem value="pie">Torta</MenuItem>
                          <MenuItem value="line">Líneas</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    {productChartType === "bar" ? (
                      <BarChart
                        key={`bar-${topN}-${productPeriod}`}
                        height={300}
                        series={[
                          {
                            data: productValues,
                            label: "Cantidad Comprada",
                            id: "cantidadId",
                          },
                        ]}
                        xAxis={[{ data: productLabels, scaleType: "band" }]}
                        yAxis={[{ valueFormatter: quantityFormatter }]}
                        colors={["#1976d2"]}
                        sx={{
                          "& .MuiChartsAxis-label": { fontSize: "0.8rem" },
                        }}
                      />
                    ) : productChartType === "pie" ? (
                      <PieChart
                        key={`pie-${topN}-${productPeriod}`}
                        series={[
                          {
                            data: productPieData,
                            arcLabel: (item) => quantityFormatter(item.value),
                            arcLabelMinAngle: 35,
                            arcLabelRadius: "60%",
                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fontWeight: "bold",
                          },
                        }}
                        width={500}
                        height={300}
                      />
                    ) : (
                      <LineChart
                        key={`line-${topN}-${productPeriod}`}
                        height={300}
                        series={[
                          {
                            data: productValues,
                            label: "Cantidad Comprada",
                            area: true,
                            color: "#1976d2",
                          },
                        ]}
                        xAxis={[{ data: productLabels, scaleType: "band" }]}
                        yAxis={[{ valueFormatter: quantityFormatter }]}
                        sx={{
                          "& .MuiChartsAxis-label": { fontSize: "0.8rem" },
                        }}
                      />
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ComprasReportes;

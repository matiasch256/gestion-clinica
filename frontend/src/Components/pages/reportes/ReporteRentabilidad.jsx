import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Skeleton,
  Container,
  Grid,
  Paper,
} from "@mui/material";

export const ReporteRentabilidad = () => {
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
  const ingresosData = data.map((d) => d.ingresos);
  const costosData = data.map((d) => d.costos);
  const utilidadData = data.map((d) => d.utilidad);

  return (
    <Container maxWidth="xl">
           
      <Grid container spacing={5} my={5}>
               
        <Grid item xs={12}>
                   
          <Paper elevation={4}>
                       
            <Box sx={{ p: 3 }}>
                           
              {loading ? (
                <>
                                   
                  <Skeleton
                    variant="text"
                    width={400}
                    height={40}
                    sx={{ mb: 5 }}
                  />
                                   
                  <Box
                    sx={{
                      display: "flex",
                      mb: 2,
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                                       
                    <Skeleton variant="rectangular" width={120} height={56} />
                                       
                    <Skeleton variant="rectangular" width={120} height={56} />
                                       
                    <Skeleton variant="rectangular" width={120} height={56} />
                                       
                    <Skeleton variant="rectangular" width={120} height={56} /> 
                                   
                  </Box>
                                   
                  <Skeleton variant="rectangular" width="100%" height={400} /> 
                               
                </>
              ) : (
                <>
                                   
                  <Typography variant="h6" gutterBottom mb={5}>
                                        Reporte de Rentabilidad: Ingresos vs.
                    Costos                  
                  </Typography>
                                   
                  <Box
                    sx={{
                      display: "flex",
                      mb: 2,
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                                       
                    <FormControl sx={{ minWidth: 120 }}>
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
                                       
                    <FormControl sx={{ minWidth: 120 }}>
                                            <InputLabel>Año Inicial</InputLabel>
                                           
                      <Select
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        label="Año Inicial"
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
                                       
                    <FormControl sx={{ minWidth: 120 }}>
                                            <InputLabel>Año Final</InputLabel> 
                                         
                      <Select
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        label="Año Final"
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
                                       
                    <FormControl sx={{ minWidth: 120 }}>
                                           
                      <InputLabel>Tipo de Gráfico</InputLabel>                 
                         
                      <Select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        label="Tipo de Gráfico"
                      >
                                               
                        <MenuItem value="bar">Barras</MenuItem>                 
                              <MenuItem value="line">Líneas</MenuItem>         
                                   
                      </Select>
                                         
                    </FormControl>
                                     
                  </Box>
                                   
                  {data.length === 0 ? (
                    <Typography sx={{ p: 4, textAlign: "center" }}>
                      No se registran movimientos en este período.
                    </Typography>
                  ) : chartType === "bar" ? (
                    <BarChart
                      height={400}
                      xAxis={[{ data: labels, scaleType: "band" }]}
                      yAxis={[{ valueFormatter: currencyFormatter }]}
                      series={[
                        {
                          data: ingresosData,
                          label: "Ingresos (ARS)",
                          color: "#4caf50",
                        },
                        {
                          data: costosData,
                          label: "Costos (ARS)",
                          color: "#d32f2f",
                        },
                        {
                          data: utilidadData,
                          label: "Utilidad (ARS)",
                          color: "#1976d2",
                        },
                      ]}
                    />
                  ) : (
                    <LineChart
                      height={400}
                      xAxis={[{ data: labels, scaleType: "band" }]}
                      yAxis={[{ valueFormatter: currencyFormatter }]}
                      series={[
                        {
                          data: ingresosData,
                          label: "Ingresos (ARS)",
                          color: "#4caf50",
                          area: true,
                          showMark: false,
                        },
                        {
                          data: costosData,
                          label: "Costos (ARS)",
                          color: "#d32f2f",
                          area: true,
                          showMark: false,
                        },
                        {
                          data: utilidadData,
                          label: "Utilidad (ARS)",
                          color: "#1976d2",
                          area: true,
                          showMark: false,
                        },
                      ]}
                    />
                  )}
                                 
                </>
              )}
                         
            </Box>
                     
          </Paper>
                 
        </Grid>
      </Grid>
    </Container>
  );
};

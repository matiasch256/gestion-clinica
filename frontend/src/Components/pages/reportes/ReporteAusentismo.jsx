import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Divider,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TotalIcon from "@mui/icons-material/ConfirmationNumber";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const KpiCard = ({ title, value, icon, colorText }) => (
  <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
    <CardContent sx={{ textAlign: "center", py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {icon}
      </Box>
      <Typography
        variant="h4"
        component="p"
        sx={{ fontWeight: "bold", mb: 1, color: colorText }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="bold">
        {title.toUpperCase()}
      </Typography>
    </CardContent>
  </Card>
);

export const ReporteAusentismo = () => {
  const theme = useTheme();
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportDate, setReportDate] = useState(new Date());

  const [profesionales, setProfesionales] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [filtros, setFiltros] = useState({
    fechaDesde: oneMonthAgo.toISOString().split("T")[0],
    fechaHasta: today.toISOString().split("T")[0],
    idProfesional: null,
    idEspecialidad: null,
  });

  const cleanColor = (color) => {
    return color ? color.replace("!important", "").trim() : color;
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Completado":
        return theme.palette.accent.green;
      case "Cancelado":
        return theme.palette.error.main;
      case "Ausente":
        return theme.palette.accent.orange;
      case "Pendiente":
        return theme.palette.primary.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/profesionales").then((res) =>
        res.json()
      ),
      fetch("http://localhost:3000/api/especialidades").then((res) =>
        res.json()
      ),
    ])
      .then(([profData, espData]) => {
        setProfesionales(profData);
        setEspecialidades(espData);
      })
      .catch((err) => {
        console.error("Error cargando filtros:", err);
        setError("Error al cargar las listas de filtros.");
      });
  }, []);

  const profesionalesFiltrados = filtros.idEspecialidad
    ? profesionales.filter(
        (p) =>
          p.Especialidad ===
          especialidades.find(
            (e) => e.ID_Especialidad === filtros.idEspecialidad
          )?.Nombre
      )
    : profesionales;

  const handleFilterChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      fechaDesde: filtros.fechaDesde,
      fechaHasta: filtros.fechaHasta,
    });
    if (filtros.idProfesional)
      params.append("idProfesional", filtros.idProfesional);
    if (filtros.idEspecialidad)
      params.append("idEspecialidad", filtros.idEspecialidad);

    try {
      const response = await fetch(
        `http://localhost:3000/api/reportes/ausentismo?${params.toString()}`
      );
      if (!response.ok)
        throw new Error("Error al cargar los datos del reporte");

      const result = await response.json();
      setSummary(result.summary);
      setDetails(result.details);
      setReportGenerated(true);
      setReportDate(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSummary(null);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    if (filtros.fechaDesde && filtros.fechaHasta) {
      handleGenerateReport();
    }
  }, []);

  const handleExportExcel = () => {
    const headers = ["Paciente", "Fecha Turno", "Profesional", "Estado"];
    const body = details.map((item) => ({
      Paciente: `${item.PacienteApellido}, ${item.PacienteNombre}`,
      FechaTurno: new Date(item.FechaHora).toLocaleString("es-AR"),
      Profesional: `${item.MedicoApellido}, ${item.MedicoNombre}`,
      Estado: item.Estado,
    }));

    const ws = utils.json_to_sheet([headers, ...body], { skipHeader: true });
    ws["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 15 }];
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Reporte Ausentismo");
    writeFile(
      wb,
      `ReporteAusentismo_${filtros.fechaDesde}_a_${filtros.fechaHasta}.xlsx`
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte: Tasa de Ausentismo", 14, 16);
    doc.setFontSize(10);
    doc.text(`Filtros: ${filtros.fechaDesde} al ${filtros.fechaHasta}`, 14, 22);
    doc.text(`Generado el: ${reportDate.toLocaleString("es-AR")}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Paciente", "Fecha Turno", "Profesional", "Estado"]],
      body: details.map((item) => [
        `${item.PacienteApellido}, ${item.PacienteNombre}`,
        new Date(item.FechaHora).toLocaleString("es-AR"),
        `${item.MedicoApellido}, ${item.MedicoNombre}`,
        item.Estado,
      ]),
      theme: "grid",
    });
    doc.save(
      `ReporteAusentismo_${filtros.fechaDesde}_a_${filtros.fechaHasta}.pdf`
    );
  };

  const pieData = summary
    ? [
        {
          id: 0,
          value: summary.TotalCompletados,
          label: "Completado",
          color: cleanColor(theme.palette.accent.green),
        },
        {
          id: 1,
          value: summary.TotalCancelados,
          label: "Cancelado",
          color: cleanColor(theme.palette.error.main),
        },
        {
          id: 2,
          value: summary.TotalPendientes,
          label: "Pendiente",
          color: cleanColor(theme.palette.primary.main),
        },
      ].filter((item) => item.value > 0)
    : [];

  useEffect(() => {
    setPage(0);
  }, [details]);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, maxWidth: "100%", margin: "0 auto" }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Reporte: Tasa de Ausentismo
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              name="fechaDesde"
              label="Fecha Desde"
              type="date"
              value={filtros.fechaDesde}
              onChange={handleFilterChange}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              name="fechaHasta"
              label="Fecha Hasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={handleFilterChange}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Autocomplete
              options={especialidades}
              getOptionLabel={(option) => option.Nombre}
              onChange={(e, value) =>
                setFiltros({
                  ...filtros,
                  idEspecialidad: value ? value.ID_Especialidad : null,
                  idProfesional: null,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Especialidad"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Autocomplete
              options={profesionalesFiltrados}
              value={
                profesionales.find(
                  (p) => p.ID_Medico === filtros.idProfesional
                ) || null
              }
              getOptionLabel={(option) =>
                `${option.Apellido}, ${option.Nombre}`
              }
              onChange={(e, value) =>
                setFiltros({
                  ...filtros,
                  idProfesional: value ? value.ID_Medico : null,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profesional"
                  size="small"
                  fullWidth
                />
              )}
              disabled={
                !filtros.idEspecialidad &&
                profesionalesFiltrados.length === profesionales.length &&
                profesionales.length > 50
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleGenerateReport}
              disabled={loading}
              fullWidth
              sx={{ height: 40 }}
            >
              {loading ? "..." : "Generar"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !reportGenerated && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ borderRadius: 2 }}
        />
      )}

      {reportGenerated && summary && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Actualizado: {reportDate.toLocaleTimeString()}
            </Typography>
            <Tooltip title="Refrescar">
              <IconButton
                onClick={handleGenerateReport}
                size="small"
                sx={{ bgcolor: theme.palette.background.trasparent }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <KpiCard
                    title="Tasa Ausentismo"
                    value={`${summary.PorcentajeAusentismo}%`}
                    icon={
                      <EventBusyIcon
                        sx={{ fontSize: 40, color: theme.palette.error.main }}
                      />
                    }
                    colorText={theme.palette.error.main}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <KpiCard
                    title="Total Turnos"
                    value={summary.TotalTurnos}
                    icon={
                      <TotalIcon
                        sx={{ fontSize: 40, color: theme.palette.primary.main }}
                      />
                    }
                    colorText={theme.palette.primary.main}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <KpiCard
                    title="Completados"
                    value={summary.TotalCompletados}
                    icon={
                      <EventAvailableIcon
                        sx={{ fontSize: 40, color: theme.palette.accent.green }}
                      />
                    }
                    colorText={theme.palette.accent.green}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pieData.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        innerRadius: 40,
                        outerRadius: 80,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        arcLabel: (item) => `${item.value}`,
                      },
                    ]}
                    height={200}
                    slotProps={{ legend: { hidden: false } }}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      },
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                    <WarningIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                    <Typography>Sin datos para graficar</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Detalle de Turnos
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AssessmentIcon />}
                  onClick={handleExportExcel}
                  disabled={details.length === 0}
                  sx={{
                    color: theme.palette.accent.green,
                    borderColor: theme.palette.accent.green,
                    "&:hover": {
                      borderColor: theme.palette.accent.green,
                      bgcolor: theme.palette.background.trasparent,
                    },
                  }}
                >
                  Excel
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleExportPDF}
                  disabled={details.length === 0}
                  sx={{
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    "&:hover": {
                      borderColor: theme.palette.error.main,
                      bgcolor: theme.palette.background.trasparent,
                    },
                  }}
                >
                  PDF
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {details.length > 0 ? (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Paciente
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Profesional
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Estado
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {details
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => {
                          const statusColor = cleanColor(
                            getStatusColor(item.Estado)
                          );
                          return (
                            <TableRow key={index} hover>
                              <TableCell>{`${item.PacienteApellido}, ${item.PacienteNombre}`}</TableCell>
                              <TableCell>
                                {new Date(item.FechaHora).toLocaleString(
                                  "es-AR"
                                )}
                              </TableCell>
                              <TableCell>{`${item.MedicoApellido}, ${item.MedicoNombre}`}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.Estado}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontWeight: "bold",
                                    border: "1px solid",
                                    borderColor: statusColor,
                                    color: statusColor,
                                    bgcolor:
                                      theme.palette.background.trasparent,
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={details.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas:"
                />
              </>
            ) : (
              <Typography
                sx={{ p: 4, textAlign: "center", color: "text.secondary" }}
              >
                No se encontraron turnos en el período seleccionado.
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

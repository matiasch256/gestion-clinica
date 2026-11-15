import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Skeleton,
  Grid,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";

import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TotalIcon from "@mui/icons-material/ConfirmationNumber";
import RefreshIcon from "@mui/icons-material/Refresh";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import FilterBar from "../../common/FilterBar";
import TableCard, { ExportButtons } from "../../common/TableCard";
import StatCard from "../../common/StatCard";
import StatusChip from "../../common/StatusChip";
import EmptyState from "../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../utils/tableLabels";

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
    // Solo al entrar: después el reporte se genera con el botón Buscar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Mismos colores de estado que usa StatusChip en la tabla.
  const pieData = summary
    ? [
        {
          id: 0,
          value: summary.TotalCompletados,
          label: "Completado",
          color: theme.palette.success.main,
        },
        {
          id: 1,
          value: summary.TotalCancelados,
          label: "Cancelado",
          color: theme.palette.error.main,
        },
        {
          id: 2,
          value: summary.TotalPendientes,
          label: "Pendiente",
          color: theme.palette.warning.main,
        },
      ].filter((item) => item.value > 0)
    : [];

  useEffect(() => {
    setPage(0);
  }, [details]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <PageHeader
        title="Tasa de ausentismo"
        subtitle={
          reportGenerated
            ? `Actualizado: ${reportDate.toLocaleString("es-AR")}`
            : "Turnos completados, cancelados y pendientes por período"
        }
        actions={
          <Tooltip title="Actualizar">
            <span>
              <IconButton
                onClick={handleGenerateReport}
                disabled={loading}
                aria-label="Actualizar"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        }
      />

      <FilterBar onSearch={handleGenerateReport}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            name="fechaDesde"
            label="Fecha desde"
            type="date"
            value={filtros.fechaDesde}
            onChange={handleFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            name="fechaHasta"
            label="Fecha hasta"
            type="date"
            value={filtros.fechaHasta}
            onChange={handleFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              <TextField {...params} label="Especialidad" fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={profesionalesFiltrados}
            value={
              profesionales.find(
                (p) => p.ID_Medico === filtros.idProfesional
              ) || null
            }
            getOptionLabel={(option) => `${option.Apellido}, ${option.Nombre}`}
            onChange={(e, value) =>
              setFiltros({
                ...filtros,
                idProfesional: value ? value.ID_Medico : null,
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Profesional" fullWidth />
            )}
            disabled={
              !filtros.idEspecialidad &&
              profesionalesFiltrados.length === profesionales.length &&
              profesionales.length > 50
            }
          />
        </Grid>
      </FilterBar>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && !reportGenerated && (
        <Skeleton variant="rounded" width="100%" height={400} />
      )}

      {reportGenerated && summary && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Tasa de ausentismo"
                value={`${summary.PorcentajeAusentismo}%`}
                icon={EventBusyIcon}
                tone="error"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Total de turnos"
                value={summary.TotalTurnos}
                icon={TotalIcon}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Completados"
                value={summary.TotalCompletados}
                icon={EventAvailableIcon}
                tone="success"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <SectionCard title="Turnos por estado" sx={{ height: "100%" }}>
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
                    height={220}
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: theme.palette.common.white,
                        fontSize: 12,
                        fontWeight: 600,
                      },
                    }}
                  />
                ) : (
                  <EmptyState title="Sin datos para graficar" />
                )}
              </SectionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <TableCard
                summary={countLabel(details.length, "turno", "turnos")}
                actions={
                  details.length > 0 && (
                    <ExportButtons
                      onExcel={handleExportExcel}
                      onPdf={handleExportPDF}
                    />
                  )
                }
              >
                {details.length > 0 ? (
                  <>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Paciente</TableCell>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Profesional</TableCell>
                          <TableCell>Estado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {details
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item, index) => (
                            <TableRow key={index} hover>
                              <TableCell>{`${item.PacienteApellido}, ${item.PacienteNombre}`}</TableCell>
                              <TableCell>
                                {new Date(item.FechaHora).toLocaleString(
                                  "es-AR"
                                )}
                              </TableCell>
                              <TableCell>{`${item.MedicoApellido}, ${item.MedicoNombre}`}</TableCell>
                              <TableCell>
                                <StatusChip status={item.Estado} />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={details.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      {...paginationLabels}
                    />
                  </>
                ) : (
                  <EmptyState
                    title="No se encontraron turnos"
                    description="No hay turnos en el período seleccionado."
                  />
                )}
              </TableCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

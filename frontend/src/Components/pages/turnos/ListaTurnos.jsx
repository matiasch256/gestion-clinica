import PageHeader from "../../common/PageHeader";
import FilterBar from "../../common/FilterBar";
import TableCard, { ExportButtons } from "../../common/TableCard";
import RowActions, { ActionButton } from "../../common/RowActions";
import StatusChip from "../../common/StatusChip";
import SkeletonRows from "../../common/SkeletonRows";
import EmptyState from "../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../utils/tableLabels";
import { useFeedback } from "../../../context/FeedbackProvider";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Paper,
  Typography,
  Box,
  Skeleton,
  TextField,
  TablePagination,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ReplayIcon from "@mui/icons-material/Replay";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const estadosDeTurno = [
  "Programado",
  "En espera",
  "Completado",
  "Cancelado",
  "Ausente",
];

export default function ListarTurnos() {
  const { notify, confirm } = useFeedback();
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    fecha: "",
    paciente: "",
    medico: "",
    estado: "",
  });
  const [tempFilters, setTempFilters] = useState({
    fecha: "",
    paciente: "",
    medico: "",
    estado: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTurno, setSelectedTurno] = useState(null);

  const handleMenuClick = (event, turno) => {
    setAnchorEl(event.currentTarget);
    setSelectedTurno(turno);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTurno(null);
  };

  const fetchTurnos = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/turnos")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setTurnos(data);
        setFilteredTurnos(data);
      })
      .catch((err) => console.error("Error al cargar turnos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  useEffect(() => {
    let result = turnos;
    if (filters.fecha) {
      result = result.filter((t) => t.FechaHora.startsWith(filters.fecha));
    }
    if (filters.paciente) {
      result = result.filter((t) =>
        t.Paciente.toLowerCase().includes(filters.paciente.toLowerCase())
      );
    }
    if (filters.medico) {
      result = result.filter((t) =>
        t.Medico.toLowerCase().includes(filters.medico.toLowerCase())
      );
    }
    if (filters.estado) {
      result = result.filter((t) => t.Estado === filters.estado);
    }
    setFilteredTurnos(result);
  }, [filters, turnos]);

  const handleTempFilterChange = (e) =>
    setTempFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const aplicarFiltros = () => {
    setFilters(tempFilters);
    setPage(0);
  };

  const limpiarFiltros = () => {
    const initial = { fecha: "", paciente: "", medico: "", estado: "" };
    setTempFilters(initial);
    setFilters(initial);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedTurnos = () => {
    const startIndex = page * rowsPerPage;
    return filteredTurnos.slice(startIndex, startIndex + rowsPerPage);
  };

  const handleEliminarTurno = async (id) => {
    const confirmado = await confirm({
      title: "Eliminar turno",
      message:
        "¿Estás seguro de que querés eliminar este turno? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!confirmado) return;
    try {
      const res = await fetch(`http://localhost:3000/api/turnos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo eliminar el turno.");
      }
      notify("El turno ha sido eliminado.");
      setTurnos((prev) => prev.filter((t) => t.ID_TurnoMedico !== id));
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const handleChangeStatus = async (id, nuevoEstado) => {
    handleMenuClose();
    const confirmado = await confirm({
      title: "Cambiar estado del turno",
      message: `¿Estás seguro de que querés cambiar el estado a "${nuevoEstado}"?`,
    });
    if (!confirmado) return;
    try {
      const res = await fetch(`http://localhost:3000/api/turnos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoEstado }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo actualizar el estado.");
      }
      notify(`El turno ahora está en estado: ${nuevoEstado}`);
      setTurnos((prev) =>
        prev.map((t) =>
          t.ID_TurnoMedico === id ? { ...t, Estado: nuevoEstado } : t
        )
      );
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const exportToExcel = () => {
    const worksheetData = filteredTurnos.map((turno) => ({
      "Fecha y Hora": new Date(turno.FechaHora).toLocaleString("es-AR"),
      Paciente: turno.Paciente,
      Médico: turno.Medico,
      Estado: turno.Estado,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Listado de Turnos");
    XLSX.writeFile(workbook, "Listado_de_Turnos.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Fecha y Hora", "Paciente", "Médico", "Estado"];
    const tableRows = filteredTurnos.map((turno) => [
      new Date(turno.FechaHora).toLocaleString("es-AR"),
      turno.Paciente,
      turno.Medico,
      turno.Estado,
    ]);

    doc.text("Listado de Turnos", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Listado_de_Turnos.pdf");
  };

  const hayFiltros =
    filters.fecha || filters.paciente || filters.medico || filters.estado;

  return (
    <>
      <PageHeader
        title="Turnos"
        subtitle="Agenda de turnos médicos"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/turnos/registrar")}
          >
            Registrar turno
          </Button>
        }
      />

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Fecha"
            type="date"
            name="fecha"
            fullWidth
            value={tempFilters.fecha}
            onChange={handleTempFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            label="Paciente"
            name="paciente"
            fullWidth
            value={tempFilters.paciente}
            onChange={handleTempFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            label="Médico"
            name="medico"
            fullWidth
            value={tempFilters.medico}
            onChange={handleTempFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            select
            label="Estado"
            name="estado"
            fullWidth
            value={tempFilters.estado}
            onChange={handleTempFilterChange}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            {estadosDeTurno.map((e) => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </FilterBar>

      <TableCard
        summary={
          loading
            ? "Cargando..."
            : countLabel(filteredTurnos.length, "turno", "turnos")
        }
        actions={<ExportButtons onExcel={exportToExcel} onPdf={exportToPDF} />}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha y hora</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={rowsPerPage} columns={5} />
            ) : getPaginatedTurnos().length > 0 ? (
              getPaginatedTurnos().map((turno) => (
                <TableRow key={turno.ID_TurnoMedico} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {new Date(turno.FechaHora).toLocaleString("es-AR")}
                  </TableCell>
                  <TableCell>{turno.Paciente}</TableCell>
                  <TableCell>{turno.Medico}</TableCell>
                  <TableCell align="center">
                    <StatusChip status={turno.Estado || "N/A"} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActions
                      onView={() =>
                        navigate(`/turnos/detalle/${turno.ID_TurnoMedico}`)
                      }
                      onEdit={
                        ["Programado", "En espera"].includes(turno.Estado)
                          ? () =>
                              navigate(
                                `/turnos/modificar/${turno.ID_TurnoMedico}`,
                                { state: { turno } }
                              )
                          : undefined
                      }
                      onDelete={() => handleEliminarTurno(turno.ID_TurnoMedico)}
                      deleteDisabled={["Atendido", "Cancelado"].includes(
                        turno.Estado
                      )}
                    >
                      <ActionButton
                        title="Cambiar estado"
                        onClick={(e) => handleMenuClick(e, turno)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </ActionButton>
                    </RowActions>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title={
                      hayFiltros
                        ? "No se encontraron turnos con esos filtros"
                        : "Todavía no hay turnos registrados"
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTurnos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          {...paginationLabels}
        />
      </TableCard>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedTurno?.Estado === "Programado" && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(selectedTurno.ID_TurnoMedico, "En espera")
            }
          >
            <ListItemIcon>
              <ThumbUpIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Marcar “En espera”</ListItemText>
          </MenuItem>
        )}
        {selectedTurno?.Estado === "En espera" && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(selectedTurno.ID_TurnoMedico, "Completado")
            }
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Marcar como “Completado”</ListItemText>
          </MenuItem>
        )}
        {["Programado", "En espera"].includes(selectedTurno?.Estado) && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(selectedTurno.ID_TurnoMedico, "Cancelado")
            }
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancelar turno</ListItemText>
          </MenuItem>
        )}
        {["Completado", "Cancelado", "Ausente"].includes(
          selectedTurno?.Estado
        ) && (
          <MenuItem
            onClick={() =>
              handleChangeStatus(selectedTurno.ID_TurnoMedico, "Programado")
            }
          >
            <ListItemIcon>
              <ReplayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reabrir turno</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

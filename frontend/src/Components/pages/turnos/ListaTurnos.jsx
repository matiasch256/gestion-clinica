import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
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

  const [notificationDialog, setNotificationDialog] = useState({
    open: false,
    title: "",
    message: "",
    isError: false,
  });
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleMenuClick = (event, turno) => {
    setAnchorEl(event.currentTarget);
    setSelectedTurno(turno);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTurno(null);
  };

  const handleCloseNotificationDialog = () =>
    setNotificationDialog({ ...notificationDialog, open: false });
  const handleOpenConfirmationDialog = (title, message, onConfirm) =>
    setConfirmationDialog({ open: true, title, message, onConfirm });
  const handleCloseConfirmationDialog = () =>
    setConfirmationDialog({ ...confirmationDialog, open: false });
  const handleConfirmAction = () => {
    if (confirmationDialog.onConfirm) confirmationDialog.onConfirm();
    handleCloseConfirmationDialog();
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

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Programado":
        return "info";
      case "En espera":
        return "primary";
      case "Completado":
        return "success";
      case "Cancelado":
        return "error";
      case "Ausente":
        return "warning";
      default:
        return "default";
    }
  };

  const handleEliminarTurno = (id) => {
    handleOpenConfirmationDialog(
      "Confirmar Eliminación",
      "¿Estás seguro de que querés eliminar este turno? Esta acción no se puede deshacer.",
      async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/turnos/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setNotificationDialog({
              open: true,
              title: "Éxito",
              message: "El turno ha sido eliminado.",
              isError: false,
            });
            setTurnos((prev) => prev.filter((t) => t.ID_TurnoMedico !== id));
          } else {
            const errorData = await res.json();
            throw new Error(errorData.error || "No se pudo eliminar el turno.");
          }
        } catch (err) {
          setNotificationDialog({
            open: true,
            title: "Error",
            message: err.message,
            isError: true,
          });
        }
      }
    );
  };

  const handleChangeStatus = (id, nuevoEstado) => {
    handleMenuClose();
    handleOpenConfirmationDialog(
      "Confirmar Cambio de Estado",
      `¿Estás seguro de que querés cambiar el estado a "${nuevoEstado}"?`,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/turnos/${id}/estado`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nuevoEstado }),
            }
          );

          if (res.ok) {
            setNotificationDialog({
              open: true,
              title: "Estado Actualizado",
              message: `El turno ahora está en estado: ${nuevoEstado}`,
              isError: false,
            });
            setTurnos((prev) =>
              prev.map((t) =>
                t.ID_TurnoMedico === id ? { ...t, Estado: nuevoEstado } : t
              )
            );
          } else {
            const errorData = await res.json();
            throw new Error(
              errorData.error || "No se pudo actualizar el estado."
            );
          }
        } catch (err) {
          setNotificationDialog({
            open: true,
            title: "Error",
            message: err.message,
            isError: true,
          });
        }
      }
    );
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

  const inputStyle = {
    bgcolor: theme.palette.background.default,
    "& .MuiOutlinedInput-root": {
      paddingLeft: "8px",
      "& input": {
        paddingLeft: "8px",
        borderLeft: "none !important",
      },
    },
  };

  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "700",
            color: theme.palette.text.primary,
            borderLeft: `5px solid ${theme.palette.primary.main}`,
            paddingLeft: 2,
          }}
        >
          Lista de Turnos
        </Typography>

        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <FilterListIcon color="action" />
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.secondary"
            >
              Filtros de Búsqueda
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                label="Fecha"
                type="date"
                name="fecha"
                fullWidth
                size="small"
                value={tempFilters.fecha}
                onChange={handleTempFilterChange}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Paciente"
                name="paciente"
                fullWidth
                size="small"
                value={tempFilters.paciente}
                onChange={handleTempFilterChange}
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Médico"
                name="medico"
                fullWidth
                size="small"
                value={tempFilters.medico}
                onChange={handleTempFilterChange}
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl
                fullWidth
                size="small"
                sx={{ bgcolor: theme.palette.background.default }}
              >
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={tempFilters.estado}
                  onChange={handleTempFilterChange}
                  label="Estado"
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {estadosDeTurno.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid
              size={{ xs: 12, md: 2 }}
              sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                onClick={aplicarFiltros}
                sx={{
                  minWidth: "auto",
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: "none",
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                <SearchIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={limpiarFiltros}
                sx={{
                  minWidth: "auto",
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  bgcolor: theme.palette.background.default,
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                    bgcolor: theme.palette.background.trasparent,
                  },
                }}
              >
                <FilterAltOffIcon />
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={exportToExcel}
            sx={{
              color: theme.palette.accent.green,
              borderColor: theme.palette.accent.green,
              backgroundColor: theme.palette.background.trasparent,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: `${theme.palette.accent.green}10 !important`,
                borderColor: theme.palette.accent.green,
              },
            }}
          >
            Exportar Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={exportToPDF}
            sx={{
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              backgroundColor: theme.palette.background.trasparent,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: `${theme.palette.error.main}10 !important`,
                borderColor: theme.palette.error.main,
              },
            }}
          >
            Exportar PDF
          </Button>
        </Box>

        {/* --- TABLA --- */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            overflowX: "auto",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.background.paper }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Fecha y Hora
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Paciente
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Médico
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                    minWidth: 150,
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="40%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="100%" />
                    </TableCell>
                  </TableRow>
                ))
              ) : getPaginatedTurnos().length > 0 ? (
                getPaginatedTurnos().map((turno) => (
                  <TableRow key={turno.ID_TurnoMedico} hover>
                    <TableCell>
                      {new Date(turno.FechaHora).toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell>{turno.Paciente}</TableCell>
                    <TableCell>{turno.Medico}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={turno.Estado || "N/A"}
                        color={getStatusColor(turno.Estado)}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: "bold",
                          minWidth: "100px",
                          backgroundColor: theme.palette.background.trasparent,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/turnos/detalle/${turno.ID_TurnoMedico}`
                              )
                            }
                            sx={{
                              color: theme.palette.primary.main,
                              backgroundColor:
                                theme.palette.background.trasparent,
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.background.trasparent,
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        {["Programado", "En espera"].includes(turno.Estado) && (
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() =>
                                navigate(
                                  `/turnos/modificar/${turno.ID_TurnoMedico}`,
                                  { state: { turno } }
                                )
                              }
                              sx={{
                                color: theme.palette.accent.orange || "#fd7e14",
                                backgroundColor:
                                  theme.palette.background.trasparent,
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.background.trasparent,
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() =>
                              handleEliminarTurno(turno.ID_TurnoMedico)
                            }
                            disabled={["Atendido", "Cancelado"].includes(
                              turno.Estado
                            )}
                            sx={{
                              color: theme.palette.error.main,
                              backgroundColor:
                                theme.palette.background.trasparent,
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.background.trasparent,
                                color: "#c82333",
                                transform: "scale(1.1)",
                              },
                              "&.Mui-disabled": {
                                color: theme.palette.action.disabled,
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Cambiar Estado">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, turno)}
                            sx={{
                              color: theme.palette.text.secondary,
                              backgroundColor:
                                theme.palette.background.trasparent,
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.background.trasparent,
                                transform: "scale(1.1)",
                                color: theme.palette.text.primary,
                              },
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
                    {filters.fecha ||
                    filters.paciente ||
                    filters.medico ||
                    filters.estado
                      ? "No se encontraron turnos con los filtros aplicados."
                      : "No se encontraron turnos."}
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
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{
              "& .MuiTablePagination-actions > button": {
                backgroundColor: theme.palette.background.trasparent,
                "&:hover": {
                  backgroundColor: theme.palette.background.trasparent,
                },
              },
            }}
          />
        </TableContainer>

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
              <ListItemText>Marcar "En espera"</ListItemText>
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
              <ListItemText>Marcar como "Completado"</ListItemText>
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
              <ListItemText>Cancelar Turno</ListItemText>
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
              <ListItemText>Reabrir Turno</ListItemText>
            </MenuItem>
          )}
        </Menu>
        <Dialog
          open={notificationDialog.open}
          onClose={handleCloseNotificationDialog}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            {notificationDialog.isError ? (
              <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
            ) : (
              <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
            )}
            {notificationDialog.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{notificationDialog.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNotificationDialog} autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={confirmationDialog.open}
          onClose={handleCloseConfirmationDialog}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <HelpOutlineIcon color="primary" sx={{ mr: 1 }} />
            {confirmationDialog.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{confirmationDialog.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmationDialog}>Cancelar</Button>
            <Button onClick={handleConfirmAction} variant="contained" autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

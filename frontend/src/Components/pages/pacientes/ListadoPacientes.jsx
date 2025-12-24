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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Tooltip,
  InputAdornment,
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

export const ListadoPacientes = () => {
  const theme = useTheme();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState({ dni: "", nombre: "" });
  const [tempFilters, setTempFilters] = useState({ dni: "", nombre: "" });

  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();

    fetch(`http://localhost:3000/api/pacientes?${queryParams}`)
      .then((res) => res.json())
      .then((data) => {
        setPacientes(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  const handleOpenConfirmationDialog = (title, message, onConfirm) =>
    setConfirmationDialog({ open: true, title, message, onConfirm });
  const handleCloseConfirmationDialog = () =>
    setConfirmationDialog({ ...confirmationDialog, open: false });
  const handleCloseNotificationDialog = () =>
    setNotificationDialog({ ...notificationDialog, open: false });
  const handleConfirmAction = () => {
    if (confirmationDialog.onConfirm) confirmationDialog.onConfirm();
    handleCloseConfirmationDialog();
  };

  const handleTempFilterChange = (e) => {
    setTempFilters({ ...tempFilters, [e.target.name]: e.target.value });
  };
  const aplicarFiltros = () => {
    setFilters(tempFilters);
    setPage(0);
  };
  const limpiarFiltros = () => {
    setTempFilters({ dni: "", nombre: "" });
    setFilters({ dni: "", nombre: "" });
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedPacientes = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return pacientes.slice(startIndex, endIndex);
  };

  const handleEliminar = (id) => {
    handleOpenConfirmationDialog(
      "Confirmar Baja de Paciente",
      "¿Estás seguro de que querés dar de baja a este paciente? Esta acción es reversible.",
      async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/pacientes/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setNotificationDialog({
              open: true,
              title: "Éxito",
              message: "Paciente dado de baja exitosamente.",
              isError: false,
            });
            setPacientes(pacientes.filter((p) => p.ID_Paciente !== id));
          } else {
            const errorData = await res.json();
            throw new Error(errorData.error || "Error al dar de baja");
          }
        } catch (error) {
          setNotificationDialog({
            open: true,
            title: "Error",
            message: error.message,
            isError: true,
          });
        }
      }
    );
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
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
        {/* CABECERA: TÍTULO Y BOTÓN REGISTRAR */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "700",
              color: theme.palette.text.primary,
              borderLeft: `5px solid ${theme.palette.primary.main}`,
              paddingLeft: 2,
            }}
          >
            Lista de Pacientes
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/pacientes/registrar")}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: "bold",
              boxShadow: "none",
              "&:hover": {
                bgcolor:
                  theme.palette.primary.hover || theme.palette.primary.dark,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            Registrar Paciente
          </Button>
        </Box>

        {/* --- SECCIÓN DE FILTROS --- */}
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

          {/* USAMOS GRID SIZE para arreglar layout de botones */}
          <Grid container spacing={3} alignItems="center">
            {/* Filtro DNI */}
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="DNI"
                name="dni"
                value={tempFilters.dni}
                onChange={handleTempFilterChange}
                variant="outlined"
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            {/* Filtro Nombre (Con Fix Visual para la lupa) */}
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                label="Nombre o Apellido"
                name="nombre"
                value={tempFilters.nombre}
                onChange={handleTempFilterChange}
                variant="outlined"
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{
                  bgcolor: theme.palette.background.default,
                  "& .MuiOutlinedInput-root": {
                    paddingLeft: "8px",
                    "& input": {
                      paddingLeft: "8px",
                      borderLeft: "none !important",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Botones Buscar/Limpiar (Arreglado el corte) */}
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={aplicarFiltros}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: "bold",
                  boxShadow: "none",
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterAltOffIcon />}
                onClick={limpiarFiltros}
                sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  bgcolor: theme.palette.background.default,
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                    bgcolor: theme.palette.background.trasparent,
                  },
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
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
                  Apellido y Nombre
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  DNI
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Teléfono
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Obra Social
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
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
                : getPaginatedPacientes().map((paciente) => (
                    <TableRow key={paciente.ID_Paciente} hover>
                      <TableCell>
                        {paciente.Apellido}, {paciente.Nombre}
                      </TableCell>
                      <TableCell>{paciente.DNI}</TableCell>
                      <TableCell>{paciente.Telefono}</TableCell>
                      <TableCell>
                        {paciente.ObraSocialNombre || "Particular"}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {/* Ver Detalle */}
                          <Tooltip title="Ver Detalle">
                            <IconButton
                              onClick={() =>
                                navigate(
                                  `/pacientes/detalle/${paciente.ID_Paciente}`
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

                          {/* Editar */}
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() =>
                                navigate(
                                  `/pacientes/modificar/${paciente.ID_Paciente}`
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

                          <Tooltip title="Dar de Baja">
                            <IconButton
                              onClick={() =>
                                handleEliminar(paciente.ID_Paciente)
                              }
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
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={pacientes.length}
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
};

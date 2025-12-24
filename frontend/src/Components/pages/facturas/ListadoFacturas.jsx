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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PaidIcon from "@mui/icons-material/Paid";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const ListadoFacturas = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const estadosDeFactura = ["Pendiente de Pago", "Pagada", "Anulada"];

  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);

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

  const [filters, setFilters] = useState({
    paciente: "",
    estado: "",
    numeroFactura: "",
  });
  const [tempFilters, setTempFilters] = useState({
    paciente: "",
    estado: "",
    numeroFactura: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();

    fetch(`http://localhost:3000/api/facturacion?${queryParams}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setFacturas(data);
      })
      .catch((err) => console.error("Error al cargar facturas:", err))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleMenuClick = (event, factura) => {
    setAnchorEl(event.currentTarget);
    setSelectedFactura(factura);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFactura(null);
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

  const handleChangeStatus = (id, nuevoEstado) => {
    handleMenuClose();
    handleOpenConfirmationDialog(
      "Confirmar Cambio de Estado",
      `¿Estás seguro de que querés cambiar el estado a "${nuevoEstado}"?`,
      async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/facturacion/${id}/estado`,
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
              message: `La factura ahora está: ${nuevoEstado}`,
              isError: false,
            });
            setFacturas((prev) =>
              prev.map((f) =>
                f.ID_FacturaPaciente === id ? { ...f, Estado: nuevoEstado } : f
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

  const handleTempFilterChange = (e) => {
    setTempFilters({ ...tempFilters, [e.target.name]: e.target.value });
  };
  const aplicarFiltros = () => {
    setPage(0);
    setFilters(tempFilters);
  };
  const limpiarFiltros = () => {
    const initialFilters = { paciente: "", estado: "", numeroFactura: "" };
    setTempFilters(initialFilters);
    setFilters(initialFilters);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getPaginatedFacturas = () => {
    const startIndex = page * rowsPerPage;
    return facturas.slice(startIndex, startIndex + rowsPerPage);
  };

  const getStatusChip = (estado) => {
    let color;
    switch (estado) {
      case "Pendiente de Pago":
        color = "warning";
        break;
      case "Pagada":
        color = "success";
        break;
      case "Anulada":
        color = "error";
        break;
      default:
        color = "default";
    }
    return (
      <Chip
        label={estado}
        color={color}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: "bold",
          backgroundColor: theme.palette.background.trasparent,
        }}
      />
    );
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  const exportToExcel = () => {
    console.log("Exportar Excel");
  };
  const exportToPDF = () => {
    console.log("Exportar PDF");
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
            Listado de Facturas
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/facturacion/registrar")}
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
            Registrar Factura
          </Button>
        </Box>

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
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Buscar por N° Factura"
                name="numeroFactura"
                value={tempFilters.numeroFactura}
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

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Buscar por Paciente"
                name="paciente"
                value={tempFilters.paciente}
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
                  label="Estado"
                  onChange={handleTempFilterChange}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {estadosDeFactura.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

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
                  N° Factura
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Fecha de Emisión
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
                  Total
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
                      <Skeleton width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="90%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="50%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="40%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width="100%" />
                    </TableCell>
                  </TableRow>
                ))
              ) : getPaginatedFacturas().length > 0 ? (
                getPaginatedFacturas().map((factura) => (
                  <TableRow key={factura.ID_FacturaPaciente} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      #{factura.ID_FacturaPaciente}
                    </TableCell>
                    <TableCell>
                      {new Date(factura.FechaEmision).toLocaleDateString(
                        "es-AR"
                      )}
                    </TableCell>
                    <TableCell>{factura.Paciente}</TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(factura.Total)}
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(factura.Estado)}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/facturacion/detalle/${factura.ID_FacturaPaciente}`
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

                        <Tooltip title="Más opciones">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, factura)}
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
                    colSpan={6}
                    align="center"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
                    No se encontraron facturas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={facturas.length}
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
          {selectedFactura?.Estado === "Pendiente de Pago" && [
            <MenuItem
              key="pagar"
              onClick={() =>
                handleChangeStatus(selectedFactura.ID_FacturaPaciente, "Pagada")
              }
            >
              <ListItemIcon>
                <PaidIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Marcar como Pagada</ListItemText>
            </MenuItem>,
            <MenuItem
              key="anular"
              onClick={() =>
                handleChangeStatus(
                  selectedFactura.ID_FacturaPaciente,
                  "Anulada"
                )
              }
            >
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Anular Factura</ListItemText>
            </MenuItem>,
          ]}
          {(selectedFactura?.Estado === "Pagada" ||
            selectedFactura?.Estado === "Anulada") && (
            <MenuItem
              onClick={() =>
                handleChangeStatus(
                  selectedFactura.ID_FacturaPaciente,
                  "Pendiente de Pago"
                )
              }
            >
              <ListItemIcon>
                <ReplayIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reabrir Factura</ListItemText>
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
};

import PageHeader from "../../common/PageHeader";
import FilterBar from "../../common/FilterBar";
import TableCard from "../../common/TableCard";
import RowActions, { ActionButton } from "../../common/RowActions";
import StatusChip from "../../common/StatusChip";
import SkeletonRows from "../../common/SkeletonRows";
import EmptyState from "../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../utils/tableLabels";
import { useFeedback } from "../../../context/FeedbackProvider";
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
  const { notify, confirm } = useFeedback();
  const navigate = useNavigate();

  const estadosDeFactura = ["Pendiente de Pago", "Pagada", "Anulada"];

  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);

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

  const handleChangeStatus = async (id, nuevoEstado) => {
    handleMenuClose();
    const confirmado = await confirm({
      title: "Cambiar estado de la factura",
      message: `¿Estás seguro de que querés cambiar el estado a "${nuevoEstado}"?`,
    });
    if (!confirmado) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/facturacion/${id}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevoEstado }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo actualizar el estado.");
      }
      notify(`La factura ahora está: ${nuevoEstado}`);
      setFacturas((prev) =>
        prev.map((f) =>
          f.ID_FacturaPaciente === id ? { ...f, Estado: nuevoEstado } : f
        )
      );
    } catch (err) {
      notify(err.message, "error");
    }
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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  const hayFiltros =
    filters.paciente || filters.estado || filters.numeroFactura;

  return (
    <>
      <PageHeader
        title="Facturas"
        subtitle="Facturación a pacientes"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/facturacion/registrar")}
          >
            Registrar factura
          </Button>
        }
      />

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            label="N° de factura"
            name="numeroFactura"
            fullWidth
            value={tempFilters.numeroFactura}
            onChange={handleTempFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
          <TextField
            label="Paciente"
            name="paciente"
            placeholder="Buscar por nombre"
            fullWidth
            value={tempFilters.paciente}
            onChange={handleTempFilterChange}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            {estadosDeFactura.map((e) => (
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
            : countLabel(facturas.length, "factura", "facturas")
        }
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nro.</TableCell>
              <TableCell>Fecha de emisión</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={rowsPerPage} columns={6} />
            ) : getPaginatedFacturas().length > 0 ? (
              getPaginatedFacturas().map((factura) => (
                <TableRow key={factura.ID_FacturaPaciente} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    #{factura.ID_FacturaPaciente}
                  </TableCell>
                  <TableCell>
                    {new Date(factura.FechaEmision).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell>{factura.Paciente}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(factura.Total)}
                  </TableCell>
                  <TableCell align="center">
                    <StatusChip
                      status={factura.Estado}
                      sx={{ textTransform: "none" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <RowActions
                      onView={() =>
                        navigate(
                          `/facturacion/detalle/${factura.ID_FacturaPaciente}`
                        )
                      }
                    >
                      <ActionButton
                        title="Cambiar estado"
                        onClick={(e) => handleMenuClick(e, factura)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </ActionButton>
                    </RowActions>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title={
                      hayFiltros
                        ? "No se encontraron facturas con esos filtros"
                        : "Todavía no hay facturas registradas"
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
          count={facturas.length}
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
            <ListItemText>Marcar como pagada</ListItemText>
          </MenuItem>,
          <MenuItem
            key="anular"
            onClick={() =>
              handleChangeStatus(selectedFactura.ID_FacturaPaciente, "Anulada")
            }
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Anular factura</ListItemText>
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
            <ListItemText>Reabrir factura</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

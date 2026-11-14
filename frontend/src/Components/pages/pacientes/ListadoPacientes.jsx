import PageHeader from "../../common/PageHeader";
import FilterBar from "../../common/FilterBar";
import TableCard from "../../common/TableCard";
import RowActions from "../../common/RowActions";
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
  const { notify, confirm } = useFeedback();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleEliminar = async (id) => {
    const confirmado = await confirm({
      title: "Dar de baja al paciente",
      message:
        "¿Estás seguro de que querés dar de baja a este paciente? Esta acción es reversible.",
      confirmLabel: "Dar de baja",
      destructive: true,
    });
    if (!confirmado) return;
    try {
      const res = await fetch(`http://localhost:3000/api/pacientes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al dar de baja");
      }
      notify("Paciente dado de baja exitosamente.");
      setPacientes((prev) => prev.filter((p) => p.ID_Paciente !== id));
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const hayFiltros = filters.dni || filters.nombre;

  return (
    <>
      <PageHeader
        title="Pacientes"
        subtitle="Padrón de pacientes de la clínica"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/pacientes/registrar")}
          >
            Registrar paciente
          </Button>
        }
      />

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            label="DNI"
            name="dni"
            value={tempFilters.dni}
            onChange={handleTempFilterChange}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 5 }}>
          <TextField
            label="Nombre o apellido"
            name="nombre"
            placeholder="Buscar por nombre"
            value={tempFilters.nombre}
            onChange={handleTempFilterChange}
            fullWidth
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
      </FilterBar>

      <TableCard
        summary={
          loading
            ? "Cargando..."
            : countLabel(pacientes.length, "paciente", "pacientes")
        }
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Apellido y nombre</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Obra social</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={5} columns={5} />
            ) : pacientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title={
                      hayFiltros
                        ? "No se encontraron pacientes con esos filtros"
                        : "Todavía no hay pacientes registrados"
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              getPaginatedPacientes().map((paciente) => (
                <TableRow key={paciente.ID_Paciente} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {paciente.Apellido}, {paciente.Nombre}
                  </TableCell>
                  <TableCell>{paciente.DNI}</TableCell>
                  <TableCell>{paciente.Telefono}</TableCell>
                  <TableCell>
                    {paciente.ObraSocialNombre || "Particular"}
                  </TableCell>
                  <TableCell align="right">
                    <RowActions
                      onView={() =>
                        navigate(`/pacientes/detalle/${paciente.ID_Paciente}`)
                      }
                      onEdit={() =>
                        navigate(`/pacientes/modificar/${paciente.ID_Paciente}`)
                      }
                      onDelete={() => handleEliminar(paciente.ID_Paciente)}
                      deleteLabel="Dar de baja"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
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
          {...paginationLabels}
        />
      </TableCard>
    </>
  );
};

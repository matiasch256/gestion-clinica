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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReplayIcon from "@mui/icons-material/Replay";
const estadosDeCompra = [
  "Pendiente",
  "Aprobada",
  "Pedido",
  "Completada",
  "Cancelada",
];

export default function ListaCompras() {
  const [compras, setCompras] = useState([]);
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fecha: "",
    proveedor: "",
    estado: "",
  });
  const [tempFilters, setTempFilters] = useState({
    fecha: "",
    proveedor: "",
    estado: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompraId, setSelectedCompraId] = useState(null);

  const navigate = useNavigate();

  const handleMenuClick = (event, compraId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompraId(compraId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompraId(null);
  };

  const fetchCompras = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/compras")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setCompras(data);
        setFilteredCompras(data);
      })
      .catch((err) => console.error("Error al cargar compras:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    let result = compras;

    if (filters.fecha) {
      result = result.filter(
        (compra) => compra.fecha && compra.fecha.startsWith(filters.fecha)
      );
    }
    if (filters.proveedor) {
      result = result.filter((compra) =>
        compra.proveedorNombre
          .toLowerCase()
          .includes(filters.proveedor.toLowerCase())
      );
    }

    // LÓGICA DE FILTRO POR ESTADO (CORREGIDA)
    // Si se selecciona un estado, filtra por ese estado exacto.
    // Si el filtro de estado está vacío ("Todos"), no se aplica este filtro.
    if (filters.estado) {
      result = result.filter((compra) => compra.estado === filters.estado);
    }

    setFilteredCompras(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, compras]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar esta compra?"))
      return;
    try {
      const res = await fetch(`http://localhost:3000/api/compras/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Compra eliminada correctamente");
        setCompras((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Error al eliminar la compra");
      }
    } catch (err) {
      alert("Error en el servidor");
    }
  };

  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    setFilters({ ...tempFilters });
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const limpiarFiltros = () => {
    const initialFilters = { fecha: "", proveedor: "", estado: "" };
    setTempFilters(initialFilters);
    setFilters(initialFilters);
    setPage(0);
  };

  const getStatusChip = (estado) => {
    let color;
    switch (estado) {
      case "Pendiente":
        color = "warning";
        break;
      case "Aprobada":
        color = "info";
        break;
      case "Pedido":
        color = "primary";
        break;
      case "Completada":
        color = "success";
        break;
      case "Cancelada":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip label={estado || "N/A"} color={color} size="small" />;
  };

  const handleChangeStatus = async (id, nuevoEstado) => {
    if (
      !window.confirm(
        `¿Estás seguro de que querés cambiar el estado a "${nuevoEstado}"?`
      )
    ) {
      handleMenuClose();
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/compras/${id}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevoEstado }),
        }
      );
      if (res.ok) {
        alert(`Compra actualizada a "${nuevoEstado}"`);
        setCompras((prevCompras) =>
          prevCompras.map((compra) =>
            compra.id === id ? { ...compra, estado: nuevoEstado } : compra
          )
        );
      } else {
        const errorData = await res.json();
        alert(
          `Error al actualizar el estado: ${
            errorData.details || "Error desconocido"
          }`
        );
      }
    } catch (err) {
      alert("Error en el servidor");
    }
    handleMenuClose();
  };

  const getPaginatedCompras = () => {
    const startIndex = page * rowsPerPage;
    return filteredCompras.slice(startIndex, startIndex + rowsPerPage);
  };

  const exportToExcel = () => {
    const worksheetData = filteredCompras.map((compra) => ({
      Fecha: new Date(compra.fecha).toLocaleDateString(),
      "Nro Compra": compra.id,
      Proveedor: compra.proveedorNombre,
      Total: compra.productos.reduce(
        (acc, p) => acc + p.Cantidad * p.Precio,
        0
      ),
      Estado: compra.estado,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Asignar formato de moneda a la columna Total (D)
    Object.keys(worksheet).forEach((cell) => {
      if (cell.startsWith("D") && cell !== "D1") {
        // D1 es el encabezado
        worksheet[cell].t = "n"; // tipo numérico
        worksheet[cell].z = "$#,##0.00"; // formato de moneda
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Compras");
    XLSX.writeFile(workbook, "Lista_de_Compras.xlsx");
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Fecha", "Nro Compra", "Proveedor", "Total", "Estado"];
    const tableRows = filteredCompras.map((compra) => [
      new Date(compra.fecha).toLocaleDateString(),
      compra.id,
      compra.proveedorNombre,
      `$${compra.productos
        .reduce((acc, p) => acc + p.Cantidad * p.Precio, 0)
        .toFixed(2)}`,
      compra.estado,
    ]);

    doc.text("Lista de Compras", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Lista_de_Compras.pdf");
  };

  const selectedCompra = compras.find((c) => c.id === selectedCompraId);

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Lista de Compras
      </Typography>

      {/* --- SECCIÓN DE FILTROS Y EXPORTACIÓN (SIN CAMBIOS) --- */}
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ mt: 3 }}>
            <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Fecha"
                  type="date"
                  name="fecha"
                  value={tempFilters.fecha}
                  onChange={handleTempFilterChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  type="input"
                  label="Proveedor"
                  name="proveedor"
                  value={tempFilters.proveedor}
                  onChange={handleTempFilterChange}
                  sx={{ minWidth: 200 }}
                  variant="outlined"
                />
                {/* FILTRO POR ESTADO (AHORA ACTIVADO Y CORRECTO) */}
                <FormControl sx={{ minWidth: 200 }}>
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
                    {estadosDeCompra.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                  onClick={aplicarFiltros}
                >
                  Buscar
                </Button>
                <Button variant="outlined" onClick={limpiarFiltros}>
                  Limpiar Filtros
                </Button>
              </Box>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
          mt: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="primary" onClick={exportToExcel}>
          Exportar a Excel
        </Button>
        <Button variant="outlined" color="secondary" onClick={exportToPDF}>
          Exportar a PDF
        </Button>
      </Box>

      {/* --- TABLA DE COMPRAS CON LÓGICA FINAL --- */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Nro Compra</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell sx={{ minWidth: 180 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : getPaginatedCompras().length > 0 ? (
              getPaginatedCompras().map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>
                    {(() => {
                      // La fecha viene como "YYYY-MM-DD"
                      const parts = compra.fecha.split("-");
                      // Creamos la fecha en UTC para evitar que el navegador la ajuste a la zona horaria local
                      const date = new Date(
                        Date.UTC(parts[0], parts[1] - 1, parts[2])
                      );
                      // La mostramos en formato local pero basado en la fecha UTC
                      return date.toLocaleDateString("es-AR", {
                        timeZone: "UTC",
                      });
                    })()}
                  </TableCell>
                  <TableCell>{compra.id}</TableCell>
                  <TableCell>{compra.proveedorNombre}</TableCell>
                  <TableCell>
                    $
                    {compra.productos
                      .reduce((acc, p) => acc + p.Cantidad * p.Precio, 0)
                      .toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusChip(compra.estado)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          navigate(`/compras/detalle/${compra.id}`)
                        }
                      >
                        Ver
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        disabled={["Completada", "Cancelada"].includes(
                          compra.estado
                        )}
                        onClick={() => handleEliminar(compra.id)}
                      >
                        Eliminar
                      </Button>

                      {/* AHORA EL IconButton SIEMPRE SE RENDERIZA */}
                      <IconButton
                        aria-label="más opciones"
                        onClick={(e) => handleMenuClick(e, compra.id)}
                        size="small"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No se encontraron compras.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCompras.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>

      {/* --- MENÚ ÚNICO Y COMPARTIDO (CON LÓGICA FINAL) --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedCompra?.estado === "Pendiente" && [
          <MenuItem
            key="approve"
            onClick={() => handleChangeStatus(selectedCompra.id, "Aprobada")}
          >
            <ListItemIcon>
              <ThumbUpIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Aprobar</ListItemText>
          </MenuItem>,
          <MenuItem
            key="edit"
            onClick={() => {
              navigate(`/compras/modificar/${selectedCompra.id}`);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>,
          <MenuItem
            key="cancel"
            onClick={() => handleChangeStatus(selectedCompra.id, "Cancelada")}
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancelar</ListItemText>
          </MenuItem>,
        ]}

        {selectedCompra?.estado === "Aprobada" && [
          <MenuItem
            key="order"
            onClick={() => handleChangeStatus(selectedCompra.id, "Pedido")}
          >
            <ListItemIcon>
              <LocalShippingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ordenar</ListItemText>
          </MenuItem>,
          <MenuItem
            key="cancel"
            onClick={() => handleChangeStatus(selectedCompra.id, "Cancelada")}
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancelar</ListItemText>
          </MenuItem>,
        ]}

        {selectedCompra?.estado === "Pedido" && (
          <MenuItem
            onClick={() => handleChangeStatus(selectedCompra.id, "Completada")}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Marcar Completada</ListItemText>
          </MenuItem>
        )}

        {(selectedCompra?.estado === "Completada" ||
          selectedCompra?.estado === "Cancelada") && (
          <MenuItem
            onClick={() => handleChangeStatus(selectedCompra.id, "Pendiente")}
          >
            <ListItemIcon>
              <ReplayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reabrir Compra</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ListaCompras() {
  const [compras, setCompras] = useState([]); // estado donde se guardan las compras
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fecha: "",
    proveedor: "",
    estado: "",
  });
  // Nuevo estado para los filtros temporales (antes de aplicar)
  const [tempFilters, setTempFilters] = useState({
    fecha: "",
    proveedor: "",
    estado: "",
  });

  // Estados para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // Función para convertir fecha de DD-MM-YYYY a YYYY-MM-DD
  const convertirFechaArgentinaAISO = (fechaArgentina) => {
    if (!fechaArgentina) return "";
    const partes = fechaArgentina.split("-");
    if (partes.length === 3) {
      const [dia, mes, año] = partes;
      return `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }
    return "";
  };

  // Función para convertir fecha de YYYY-MM-DD a DD-MM-YYYY
  const convertirFechaISOAArgentina = (fechaISO) => {
    if (!fechaISO) return "";
    const partes = fechaISO.split("-");
    if (partes.length === 3) {
      const [año, mes, dia] = partes;
      return `${dia}-${mes}-${año}`;
    }
    return "";
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/compras")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCompras(data);
        setFilteredCompras(data); // Inicialmente, mostrar todas las compras
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar compras:", err);
        setLoading(false); // Asegúrate de desactivar loading incluso en error
      });
  }, []);

  useEffect(() => {
    let result = [...compras];
    console.log("results:", result);

    // Filtro por fecha
    if (filters.fecha) {
      result = result.filter((compra) => {
        if (!compra.fecha) return false;

        // Convertir la fecha de la compra (DD-MM-YYYY) a formato ISO (YYYY-MM-DD) para comparar
        const fechaCompraISO = convertirFechaArgentinaAISO(compra.fecha);

        console.log("compra fecha original: ", compra.fecha);
        console.log("compra fecha convertida a ISO: ", fechaCompraISO);

        console.log("filtro fecha: ", filters.fecha);

        return fechaCompraISO === convertirFechaArgentinaAISO(filters.fecha);
      });
    }

    // Filtro por proveedor
    if (filters.proveedor) {
      result = result.filter((compra) =>
        compra.proveedorNombre
          .toLowerCase()
          .includes(filters.proveedor.toLowerCase())
      );
    }

    // Filtro por estado
    if (filters.estado) {
      result = result.filter(
        (compra) =>
          compra.estado?.toLowerCase() === filters.estado.toLowerCase()
      );
    }

    setFilteredCompras(result);
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

  // Manejar cambios en los filtros temporales
  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Función para aplicar los filtros (botón Buscar)
  const aplicarFiltros = () => {
    setFilters({ ...tempFilters });
    setPage(0); // Resetear a la primera página cuando se aplican filtros
  };

  // Funciones para manejar la paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Obtener las compras para la página actual
  const getPaginatedCompras = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredCompras.slice(startIndex, endIndex);
  };

  const limpiarFiltros = () => {
    setTempFilters({
      fecha: "",
      proveedor: "",
      estado: "",
    });
    setFilters({
      fecha: "",
      proveedor: "",
      estado: "",
    });
    setPage(0); // Resetear a la primera página cuando se limpian filtros
  };

  const exportToExcel = () => {
    const worksheetData = filteredCompras.map((compra) => ({
      Fecha: convertirFechaISOAArgentina(compra.fecha), // Mantener formato argentino
      "Nro Compra": compra.id,
      Proveedor: compra.proveedorNombre,
      Total: `$${compra.productos
        .reduce((acc, p) => acc + p.Cantidad * p.Precio, 0)
        .toFixed(2)}`,
      Estado: compra.estado || "activo",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Compras");
    XLSX.writeFile(workbook, "Lista_de_Compras.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Fecha", "Nro Compra", "Proveedor", "Total", "Estado"];
    const tableRows = filteredCompras.map((compra) => [
      convertirFechaISOAArgentina(compra.fecha), // Mantener formato argentino
      compra.id,
      compra.proveedorNombre,
      `$${compra.productos
        .reduce((acc, p) => acc + p.Cantidad * p.Precio, 0)
        .toFixed(2)}`,
      compra.estado || "activo",
    ]);

    doc.text("Lista de Compras", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Lista_de_Compras.pdf");
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Lista de Compras
      </Typography>
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
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
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ minWidth: 200, "& .MuiInputBase-root": { height: 56 } }}
                />
                <TextField
                  type="input"
                  label="Proveedor"
                  name="proveedor"
                  value={tempFilters.proveedor}
                  onChange={handleTempFilterChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ minWidth: 200, "& .MuiInputBase-root": { height: 56 } }}
                  variant="outlined"
                />
                {/* FILTRO POR ESTADO */}
                {/* <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={tempFilters.estado}
                    onChange={handleTempFilterChange}
                    label="Estado"
                    sx={{ height: 56 }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl> */}
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
                  sx={{
                    height: 50,
                    backgroundColor: "#1976d2 !important",
                    "&:hover": { backgroundColor: "#115293 !important" },
                    color: "#fff !important",
                  }}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  onClick={limpiarFiltros}
                  sx={{
                    height: 50,
                    borderColor: "#dc004e !important",
                    color: "#dc004e !important",
                    backgroundColor: "transparent !important",

                    "&:hover": {
                      borderColor: "#9a0036 !important",
                      backgroundColor: "rgba(220, 0, 78, 0.04) !important",
                    },
                    fontFamily: "Roboto",
                  }}
                >
                  Limpiar Filtros
                </Button>
              </Box>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Box>
      {/* Sección de Filtros */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          color="primary"
          onClick={exportToExcel}
          sx={{
            height: 50,
            mt: 4,
            borderColor: "#2e7d32 !important",
            color: "#2e7d32 !important",
            backgroundColor: "transparent !important",

            "&:hover": {
              borderColor: "#1b5e20 !important",
              backgroundColor: "rgba(46, 125, 50, 0.04) !important",
            },
          }}
        >
          Exportar a Excel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={exportToPDF}
          sx={{
            height: 50,
            mt: 4,
            borderColor: "#dc004e !important",
            color: "#dc004e !important",
            backgroundColor: "transparent !important",
            "&:hover": {
              borderColor: "#9a0036 !important",
              backgroundColor: "rgba(220, 0, 78, 0.04) !important",
            },
          }}
        >
          Exportar a PDF
        </Button>
      </Box>

      {/* Tabla de Compras */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Nro Compra</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="90%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="70%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={150} height={36} />
                  </TableCell>
                </TableRow>
              ))
            ) : getPaginatedCompras().length > 0 ? (
              getPaginatedCompras().map((compra, index) => {
                const total = compra.productos.reduce(
                  (acc, p) => acc + p.Cantidad * p.Precio,
                  0
                );
                return (
                  <TableRow key={compra.id || index}>
                    <TableCell>
                      {convertirFechaISOAArgentina(compra.fecha)}
                    </TableCell>
                    <TableCell>{compra.id}</TableCell>
                    <TableCell>{compra.proveedorNombre}</TableCell>
                    <TableCell>${total.toFixed(2)}</TableCell>
                    <TableCell>{compra.estado || "activo"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          navigate(`/compras/detalle/${compra.id}`)
                        }
                        sx={{
                          mr: 1,
                          mb: 1,
                          borderColor: "#1976d2 !important",
                          color: "#1976d2 !important",
                          backgroundColor: "transparent !important",
                          "&:hover": {
                            borderColor: "#115293 !important",
                            backgroundColor:
                              "rgba(25, 118, 210, 0.04) !important",
                          },
                        }}
                        size="small"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={() =>
                          navigate(`/compras/modificar/${compra.id}`)
                        }
                        sx={{
                          mr: 1,
                          mb: 1,
                          borderColor: "#f57c00 !important",
                          color: "#f57c00 !important",
                          backgroundColor: "transparent !important",
                          "&:hover": {
                            borderColor: "#b53d00 !important",
                            backgroundColor:
                              "rgba(245, 124, 0, 0.04) !important",
                          },
                        }}
                        size="small"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleEliminar(compra.id)}
                        sx={{
                          mb: 1,
                          borderColor: "#d32f2f !important",
                          color: "#d32f2f !important",
                          backgroundColor: "transparent !important",
                          "&:hover": {
                            borderColor: "#b71c1c !important",
                            backgroundColor:
                              "rgba(211, 47, 47, 0.04) !important",
                          },
                        }}
                        size="small"
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {filters.fecha || filters.proveedor || filters.estado
                    ? "No se encontraron compras con los filtros aplicados."
                    : "No se encontraron compras."}
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
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
}

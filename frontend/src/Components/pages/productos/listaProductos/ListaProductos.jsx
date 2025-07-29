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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StockAlertWidget from "./StockAlertWidget";

export function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    nombre: "",
  });
  const [tempFilters, setTempFilters] = useState({
    nombre: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // Función para determinar el estado del stock
  const getStockStatus = (stock, stockMinimo) => {
    if (stock <= stockMinimo) {
      return { color: "#d32f2f", label: "Bajo" }; // Rojo
    } else if (stock <= stockMinimo * 1.1) {
      return { color: "#f57c00", label: "Cercano al límite" }; // Naranja
    } else {
      return { color: "#2e7d32", label: "OK" }; // Verde
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setFilteredProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...productos];
    if (filters.nombre) {
      result = result.filter((producto) =>
        producto.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }
    setFilteredProductos(result);
  }, [filters, productos]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este producto?"))
      return;

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Producto eliminado correctamente");
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
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

  const getPaginatedProductos = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredProductos.slice(startIndex, endIndex);
  };

  const limpiarFiltros = () => {
    setTempFilters({
      nombre: "",
    });
    setFilters({
      nombre: "",
    });
    setPage(0);
  };

  const exportToExcel = () => {
    const worksheetData = filteredProductos.map((producto) => ({
      Nombre: producto.nombre,
      Descripción: producto.descripcion,
      "Unidad de Medida": producto.unidadMedida,
      Stock: producto.stock,
      "Stock Mínimo": producto.stockMinimo,
      Estado: getStockStatus(producto.stock, producto.stockMinimo).label,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Productos");
    XLSX.writeFile(workbook, "Lista_de_Productos.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Nombre",
      "Descripción",
      "Unidad",
      "Stock",
      "Stock Mín",
      "Estado",
    ];
    const tableRows = filteredProductos.map((producto) => [
      producto.nombre,
      producto.descripcion,
      producto.unidadMedida,
      producto.stock,
      producto.stockMinimo,
      getStockStatus(producto.stock, producto.stockMinimo).label,
    ]);

    doc.text("Lista de Productos", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Lista_de_Productos.pdf");
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Lista de Productos
      </Typography>

      {/* Widget de Alertas */}
      {!loading && <StockAlertWidget productos={filteredProductos} />}

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
                  type="select"
                  label="Nombre del Producto"
                  name="nombre"
                  value={tempFilters.nombre}
                  onChange={handleTempFilterChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ minWidth: 300, "& .MuiInputBase-root": { height: 56 } }}
                  variant="outlined"
                  placeholder="Buscar por nombre..."
                />
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

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Unidad de Medida</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Stock Mínimo</TableCell>
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
                    <Skeleton variant="text" width="90%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="50%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="50%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="50%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={200} height={36} />
                  </TableCell>
                </TableRow>
              ))
            ) : getPaginatedProductos().length > 0 ? (
              getPaginatedProductos().map((producto, index) => {
                const status = getStockStatus(
                  producto.stock,
                  producto.stockMinimo
                );
                return (
                  <TableRow key={producto.id || index}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>{producto.unidadMedida}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>{producto.stockMinimo}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircleIcon
                          sx={{ color: status.color, fontSize: 12 }}
                        />
                        <Typography variant="body2">{status.label}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            navigate(`/productos/detalle/${producto.id}`)
                          }
                          sx={{
                            minWidth: "auto",
                            padding: "4px 8px",
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
                            navigate(`/productos/modificar/${producto.id}`)
                          }
                          sx={{
                            minWidth: "auto",
                            padding: "4px 8px",
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
                          onClick={() => handleEliminar(producto.id)}
                          sx={{
                            minWidth: "auto",
                            padding: "4px 8px",
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
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {filters.nombre
                    ? "No se encontraron productos con los filtros aplicados."
                    : "No se encontraron productos."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredProductos.length}
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

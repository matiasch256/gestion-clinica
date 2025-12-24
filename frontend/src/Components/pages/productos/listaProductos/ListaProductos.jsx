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
  Grid,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CircleIcon from "@mui/icons-material/Circle";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import StockAlertWidget from "./StockAlertWidget";

export function ListaProductos() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ nombre: "" });
  const [tempFilters, setTempFilters] = useState({ nombre: "" });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getStockStatus = (stock, stockMinimo) => {
    if (stock <= stockMinimo) {
      return { color: theme.palette.error.main, label: "Bajo" };
    } else if (stock <= stockMinimo * 1.1) {
      return {
        color: theme.palette.accent.orange || "#f57c00",
        label: "Cercano al límite",
      };
    } else {
      return { color: theme.palette.accent.green || "#2e7d32", label: "OK" };
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

  const limpiarFiltros = () => {
    setTempFilters({ nombre: "" });
    setFilters({ nombre: "" });
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
          Lista de Productos
        </Typography>

        {!loading && (
          <Box sx={{ mb: 4 }}>
            <StockAlertWidget productos={filteredProductos} />
          </Box>
        )}

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
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre del Producto"
                name="nombre"
                variant="outlined"
                value={tempFilters.nombre}
                onChange={handleTempFilterChange}
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

            <Grid
              size={{ xs: 12, md: 6 }}
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
                  "&:hover": {
                    bgcolor:
                      theme.palette.primary.hover || theme.palette.primary.dark,
                    boxShadow: "none",
                  },
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
                  Nombre
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Descripción
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Unidad
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Stock
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Stock Mín
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
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
                      <Skeleton variant="rectangular" width={120} height={36} />
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
                    <TableRow key={producto.id || index} hover>
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
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: status.color }}
                          >
                            {status.label}
                          </Typography>
                        </Box>
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
                                navigate(`/productos/detalle/${producto.id}`)
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

                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() =>
                                navigate(`/productos/modificar/${producto.id}`)
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

                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleEliminar(producto.id)}
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
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
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
      </Paper>
    </Box>
  );
}

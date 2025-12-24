import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
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
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  TableHead,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ListaCompras() {
  const theme = useTheme();
  const navigate = useNavigate();

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

  const convertirFechaArgentinaAISO = (fechaArgentina) => {
    if (!fechaArgentina) return "";
    const partes = fechaArgentina.split("-");
    if (partes.length === 3) {
      const [dia, mes, año] = partes;
      return `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }
    return "";
  };

  const convertirFechaISOAArgentina = (fechaISO) => {
    if (!fechaISO) return "";
    const partes = fechaISO.split("-");
    if (partes.length === 3) {
      const [año, mes, dia] = partes;
      return `${dia}-${mes}-${año}`;
    }
    return "";
  };

  const getStatusColor = (estado) => {
    if (!estado) return "default";
    const status = estado.toLowerCase();
    if (status === "aprobada" || status === "activo" || status === "completada")
      return "success";
    if (status === "pendiente") return "warning";
    if (
      status === "cancelada" ||
      status === "inactivo" ||
      status === "eliminada"
    )
      return "error";
    return "default";
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/compras")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCompras(data);
        setFilteredCompras(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar compras:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...compras];
    if (filters.fecha) {
      result = result.filter((compra) => {
        if (!compra.fecha) return false;
        const fechaCompraISO = convertirFechaArgentinaAISO(compra.fecha);
        return fechaCompraISO === convertirFechaArgentinaAISO(filters.fecha);
      });
    }
    if (filters.proveedor) {
      result = result.filter((compra) =>
        compra.proveedorNombre
          .toLowerCase()
          .includes(filters.proveedor.toLowerCase())
      );
    }
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

  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    setFilters({ ...tempFilters });
    setPage(0);
  };

  const limpiarFiltros = () => {
    const emptyFilters = { fecha: "", proveedor: "", estado: "" };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedCompras = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredCompras.slice(startIndex, endIndex);
  };

  const exportToExcel = () => {
    const worksheetData = filteredCompras.map((compra) => ({
      Fecha: convertirFechaISOAArgentina(compra.fecha),
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
      convertirFechaISOAArgentina(compra.fecha),
      compra.id,
      compra.proveedorNombre,
      `$${compra.productos
        .reduce((acc, p) => acc + p.Cantidad * p.Precio, 0)
        .toFixed(2)}`,
      compra.estado || "activo",
    ]);
    doc.text("Lista de Compras", 14, 15);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Lista_de_Compras.pdf");
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
          Lista de Compras
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
            <Grid size={{ xs: 12, md: 3 }}>
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

            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                type="text"
                label="Buscar Proveedor"
                name="proveedor"
                fullWidth
                size="small"
                value={tempFilters.proveedor}
                onChange={handleTempFilterChange}
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0 }}>
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
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
                  color: theme.palette.primary.contrastText,
                  bgcolor: theme.palette.primary.main,

                  fontWeight: "bold",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: theme.palette.primary.main.hover,
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
                    bgcolor: "rgba(0, 0, 0, 0.04)",
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
              bgcolor: theme.palette.background.default,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: `${theme.palette.accent.green}10`,
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
              bgcolor: theme.palette.background.default,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: theme.palette.background.redlighter,
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
                  Fecha
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Nro Compra
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Proveedor
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
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </TableCell>
                  </TableRow>
                ))
              ) : getPaginatedCompras().length > 0 ? (
                getPaginatedCompras().map((compra) => {
                  const total = compra.productos.reduce(
                    (acc, p) => acc + p.Cantidad * p.Precio,
                    0
                  );

                  return (
                    <TableRow key={compra.id} hover>
                      <TableCell>
                        {convertirFechaISOAArgentina(compra.fecha)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        #{compra.id}
                      </TableCell>
                      <TableCell>{compra.proveedorNombre}</TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                        }}
                      >
                        ${total.toFixed(2)}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={compra.estado || "Activo"}
                          color={getStatusColor(compra.estado || "Activo")}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: "bold",
                            minWidth: "80px",
                            bgcolor: theme.palette.background.default,
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
                                navigate(`/compras/detalle/${compra.id}`)
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
                                navigate(`/compras/modificar/${compra.id}`)
                              }
                              sx={{
                                color: theme.palette.accent.orange || "#fd7e14",
                                backgroundColor: "transparent !important",
                                "&:hover": {
                                  backgroundColor: "transparent !important",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleEliminar(compra.id)}
                              sx={{
                                color: theme.palette.error.main,
                                backgroundColor: "transparent !important",
                                "&:hover": {
                                  backgroundColor: "transparent !important",
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
                    colSpan={6}
                    align="center"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
                    {filters.fecha || filters.proveedor || filters.estado
                      ? "No se encontraron compras con los filtros aplicados."
                      : "No hay compras registradas."}
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

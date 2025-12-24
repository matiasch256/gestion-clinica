import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
  TablePagination,
  Grid,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ListadoCategorias = () => {
  const theme = useTheme();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtro, setFiltro] = useState("");
  const [tempFiltro, setTempFiltro] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const obtenerCategorias = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener categorías:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleEditar = (categoria) => {
    navigate(`/categorias/actualizar/${categoria.id}`);
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar categoría");
        obtenerCategorias();
      })
      .catch((err) => alert(err.message));
  };

  const aplicarFiltros = () => {
    setFiltro(tempFiltro);
    setPage(0);
  };

  const limpiarFiltros = () => {
    setTempFiltro("");
    setFiltro("");
    setPage(0);
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedCategorias = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return categoriasFiltradas.slice(startIndex, endIndex);
  };

  const exportToExcel = () => {
    const worksheetData = categoriasFiltradas.map((c) => ({
      ID: c.id,
      Nombre: c.nombre,
      Descripción: c.descripcion,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categorías");
    XLSX.writeFile(workbook, "Listado_Categorias.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Nombre", "Descripción"];
    const tableRows = categoriasFiltradas.map((c) => [
      c.id,
      c.nombre,
      c.descripcion,
    ]);

    doc.text("Listado de Categorías", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Listado_Categorias.pdf");
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
        {}
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
          Listado de Categorías
        </Typography>

        {}
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
            {}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre"
                name="nombre"
                variant="outlined"
                value={tempFiltro}
                onChange={(e) => setTempFiltro(e.target.value)}
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

            {}
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
                    bgcolor: theme.palette.background.trasparent,
                  },
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Box>

        {}
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

        {}
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
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={120} height={36} />
                    </TableCell>
                  </TableRow>
                ))
              ) : getPaginatedCategorias().length > 0 ? (
                getPaginatedCategorias().map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.descripcion}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => handleEditar(c)}
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
                            onClick={() => handleEliminar(c.id)}
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
                    {filtro
                      ? "No se encontraron categorías con los filtros aplicados."
                      : "No se encontraron categorías."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={categoriasFiltradas.length}
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
};

import React, { useState, useEffect } from "react";
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

export const ListadoProveedores = () => {
  const theme = useTheme();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtro, setFiltro] = useState("");
  const [tempFiltro, setTempFiltro] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const obtenerProveedores = () => {
    setLoading(true);
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener proveedores:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const handleEditar = (proveedor) => {
    navigate(`/proveedores/actualizar/${proveedor.id}`);
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    fetch(`http://localhost:3000/proveedores/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar proveedor");
        obtenerProveedores();
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

  const proveedoresFiltrados = proveedores.filter((p) => {
    const texto = filtro.toLowerCase();
    const nombreMatch = p.nombre.toLowerCase().includes(texto);
    const barrioMatch = p.barrio
      ? p.barrio.toLowerCase().includes(texto)
      : false;

    return nombreMatch || barrioMatch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPaginatedProveedores = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return proveedoresFiltrados.slice(startIndex, endIndex);
  };

  const exportToExcel = () => {
    const worksheetData = proveedoresFiltrados.map((p) => ({
      ID: p.id,
      Nombre: p.nombre,
      Dirección: p.direccion,
      Barrio: p.barrio,
      Teléfono: p.telefono,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proveedores");
    XLSX.writeFile(workbook, "Listado_Proveedores.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nombre", "Dirección", "Barrio", "Teléfono"];
    const tableRows = proveedoresFiltrados.map((p) => [
      p.nombre,
      p.direccion,
      p.barrio,
      p.telefono,
    ]);

    doc.text("Listado de Proveedores", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Listado_Proveedores.pdf");
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
          Listado de Proveedores
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
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Buscar por nombre o barrio"
                value={tempFiltro}
                onChange={(e) => setTempFiltro(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                size="small"
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
                  Dirección
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Barrio
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
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </TableCell>
                  </TableRow>
                ))
              ) : getPaginatedProveedores().length > 0 ? (
                getPaginatedProveedores().map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.direccion}</TableCell>
                    <TableCell>{p.barrio}</TableCell>
                    <TableCell>{p.telefono}</TableCell>
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
                            onClick={() => handleEditar(p)}
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
                            onClick={() => handleEliminar(p.id)}
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
                    colSpan={5}
                    align="center"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
                    {filtro
                      ? "No se encontraron proveedores con los filtros aplicados."
                      : "No se encontraron proveedores."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={proveedoresFiltrados.length}
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

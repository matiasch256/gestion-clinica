import PageHeader from "../../../common/PageHeader";
import FilterBar from "../../../common/FilterBar";
import TableCard, { ExportButtons } from "../../../common/TableCard";
import RowActions from "../../../common/RowActions";
import SkeletonRows from "../../../common/SkeletonRows";
import EmptyState from "../../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../../utils/tableLabels";
import { useFeedback } from "../../../../context/FeedbackProvider";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const { notify, confirm } = useFeedback();
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

  const handleEliminar = async (id) => {
    const confirmado = await confirm({
      title: "Eliminar categoría",
      message: "¿Estás seguro de eliminar esta categoría?",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!confirmado) return;

    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar categoría");
        notify("Categoría eliminada correctamente");
        obtenerCategorias();
      })
      .catch((err) => notify(err.message, "error"));
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
    <>
      <PageHeader
        title="Categorías"
        subtitle="Agrupan los productos del depósito"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/categorias/registrar")}
          >
            Registrar categoría
          </Button>
        }
      />

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre"
            placeholder="Buscar"
            value={tempFiltro}
            onChange={(e) => setTempFiltro(e.target.value)}
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
            : countLabel(categoriasFiltradas.length, "categoría", "categorías")
        }
        actions={<ExportButtons onExcel={exportToExcel} onPdf={exportToPDF} />}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={5} columns={3} />
            ) : getPaginatedCategorias().length > 0 ? (
              getPaginatedCategorias().map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.nombre}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell align="right">
                    <RowActions
                      onEdit={() => handleEditar(item)}
                      onDelete={() => handleEliminar(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <EmptyState
                    title={
                      filtro
                        ? "No se encontraron categorías con ese filtro"
                        : "Todavía no hay categorías registradas"
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
          count={categoriasFiltradas.length}
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

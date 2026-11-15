import PageHeader from "../../../common/PageHeader";
import FilterBar from "../../../common/FilterBar";
import TableCard, { ExportButtons } from "../../../common/TableCard";
import RowActions from "../../../common/RowActions";
import SkeletonRows from "../../../common/SkeletonRows";
import EmptyState from "../../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../../utils/tableLabels";
import { useFeedback } from "../../../../context/FeedbackProvider";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
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

export const ListadoProveedores = () => {
  const { notify, confirm } = useFeedback();
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

  const handleEliminar = async (id) => {
    const confirmado = await confirm({
      title: "Eliminar proveedor",
      message: "¿Estás seguro de eliminar este proveedor?",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!confirmado) return;

    fetch(`http://localhost:3000/proveedores/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar proveedor");
        notify("Proveedor eliminado correctamente");
        obtenerProveedores();
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
    <>
      <PageHeader
        title="Proveedores"
        subtitle="Empresas a las que se les compran insumos"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/proveedores/registrar")}
          >
            Registrar proveedor
          </Button>
        }
      />

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre o barrio"
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
            : countLabel(
                proveedoresFiltrados.length,
                "proveedor",
                "proveedores"
              )
        }
        actions={<ExportButtons onExcel={exportToExcel} onPdf={exportToPDF} />}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Barrio</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={5} columns={5} />
            ) : getPaginatedProveedores().length > 0 ? (
              getPaginatedProveedores().map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.nombre}</TableCell>
                  <TableCell>{item.direccion}</TableCell>
                  <TableCell>{item.barrio}</TableCell>
                  <TableCell>{item.telefono}</TableCell>
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
                <TableCell colSpan={5}>
                  <EmptyState
                    title={
                      filtro
                        ? "No se encontraron proveedores con ese filtro"
                        : "Todavía no hay proveedores registrados"
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
          count={proveedoresFiltrados.length}
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

import PageHeader from "../../../common/PageHeader";
import FilterBar from "../../../common/FilterBar";
import TableCard, { ExportButtons } from "../../../common/TableCard";
import RowActions from "../../../common/RowActions";
import StatusChip from "../../../common/StatusChip";
import SkeletonRows from "../../../common/SkeletonRows";
import EmptyState from "../../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../../utils/tableLabels";
import { getStockStatus } from "../../../../utils/stock";
import { useFeedback } from "../../../../context/FeedbackProvider";
import AddIcon from "@mui/icons-material/Add";
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
  const { notify, confirm } = useFeedback();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ nombre: "" });
  const [tempFilters, setTempFilters] = useState({ nombre: "" });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    const confirmado = await confirm({
      title: "Eliminar producto",
      message: "¿Estás seguro de que querés eliminar este producto?",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!confirmado) return;

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        notify("Producto eliminado correctamente");
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } else {
        notify("Error al eliminar el producto", "error");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      notify("Error en el servidor", "error");
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
    <>
      <PageHeader
        title="Productos"
        subtitle="Inventario de insumos y su estado de stock"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/productos/registrar")}
          >
            Registrar producto
          </Button>
        }
      />

      {!loading && (
        <Box sx={{ mb: 2 }}>
          <StockAlertWidget productos={filteredProductos} />
        </Box>
      )}

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nombre del producto"
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
            : countLabel(filteredProductos.length, "producto", "productos")
        }
        actions={<ExportButtons onExcel={exportToExcel} onPdf={exportToPDF} />}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Stock mín.</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={rowsPerPage} columns={7} />
            ) : getPaginatedProductos().length > 0 ? (
              getPaginatedProductos().map((producto, index) => {
                const status = getStockStatus(
                  producto.stock,
                  producto.stockMinimo
                );
                return (
                  <TableRow key={producto.id || index} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {producto.nombre}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {producto.descripcion}
                    </TableCell>
                    <TableCell>{producto.unidadMedida}</TableCell>
                    <TableCell align="right">{producto.stock}</TableCell>
                    <TableCell align="right">{producto.stockMinimo}</TableCell>
                    <TableCell align="center">
                      <StatusChip
                        color={status.tone}
                        status={status.label}
                        sx={{ textTransform: "none" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <RowActions
                        onView={() =>
                          navigate(`/productos/detalle/${producto.id}`)
                        }
                        onEdit={() =>
                          navigate(`/productos/modificar/${producto.id}`)
                        }
                        onDelete={() => handleEliminar(producto.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    title={
                      filters.nombre
                        ? "No se encontraron productos con ese nombre"
                        : "Todavía no hay productos registrados"
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
          count={filteredProductos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          {...paginationLabels}
        />
      </TableCard>
    </>
  );
}

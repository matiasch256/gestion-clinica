import PageHeader from "../../../common/PageHeader";
import FilterBar from "../../../common/FilterBar";
import TableCard, { ExportButtons } from "../../../common/TableCard";
import RowActions from "../../../common/RowActions";
import StatusChip from "../../../common/StatusChip";
import SkeletonRows from "../../../common/SkeletonRows";
import EmptyState from "../../../common/EmptyState";
import { paginationLabels, countLabel } from "../../../../utils/tableLabels";
import { useFeedback } from "../../../../context/FeedbackProvider";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { notify, confirm } = useFeedback();

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
    const confirmado = await confirm({
      title: "Eliminar compra",
      message: `¿Estás seguro de que querés eliminar la compra #${id}?`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!confirmado) return;
    try {
      const res = await fetch(`http://localhost:3000/api/compras/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        notify("Compra eliminada correctamente");
        setCompras((prev) => prev.filter((c) => c.id !== id));
      } else {
        notify("Error al eliminar la compra", "error");
      }
    } catch {
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

  const hayFiltros = filters.fecha || filters.proveedor || filters.estado;

  return (
    <>
      <PageHeader
        title="Compras"
        subtitle="Órdenes de compra registradas"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/compras/registrar")}
          >
            Registrar compra
          </Button>
        }
      />

      <FilterBar onSearch={aplicarFiltros} onClear={limpiarFiltros}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField
            label="Fecha"
            type="date"
            name="fecha"
            fullWidth
            value={tempFilters.fecha}
            onChange={handleTempFilterChange}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 5 }}>
          <TextField
            label="Proveedor"
            name="proveedor"
            placeholder="Buscar por nombre"
            fullWidth
            value={tempFilters.proveedor}
            onChange={handleTempFilterChange}
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
            : countLabel(filteredCompras.length, "compra", "compras")
        }
        actions={<ExportButtons onExcel={exportToExcel} onPdf={exportToPDF} />}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nro.</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows rows={rowsPerPage} columns={6} />
            ) : getPaginatedCompras().length > 0 ? (
              getPaginatedCompras().map((compra) => {
                const total = compra.productos.reduce(
                  (acc, p) => acc + p.Cantidad * p.Precio,
                  0
                );

                return (
                  <TableRow key={compra.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{compra.id}</TableCell>
                    <TableCell>
                      {convertirFechaISOAArgentina(compra.fecha)}
                    </TableCell>
                    <TableCell>{compra.proveedorNombre}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${total.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <StatusChip status={compra.estado || "Activo"} />
                    </TableCell>
                    <TableCell align="right">
                      <RowActions
                        onView={() => navigate(`/compras/detalle/${compra.id}`)}
                        onEdit={() =>
                          navigate(`/compras/modificar/${compra.id}`)
                        }
                        onDelete={() => handleEliminar(compra.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title={
                      hayFiltros
                        ? "No se encontraron compras con esos filtros"
                        : "Todavía no hay compras registradas"
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
          count={filteredCompras.length}
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

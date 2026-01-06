import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Chip, Alert, CircularProgress } from "@mui/material";

import { GenericTable } from "../../../common/dataDisplay/GenericTable";
import {
  getProductos,
  deleteProducto,
} from "../../../../services/productosService";

import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ListaProductos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleDelete = async (row) => {
    if (window.confirm(`¿Eliminar ${row.nombre}?`)) {
      try {
        await deleteProducto(row.id);
        cargarDatos();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(
      productos.map((p) => ({
        Nombre: p.nombre,
        Código: p.codigo || "-",
        Stock: p.stock,
        Unidad: p.unidadMedida,
        Estado: p.activo ? "Activo" : "Inactivo",
      }))
    );
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Productos");
    writeFile(wb, "Listado_Productos.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Productos", 14, 16);

    const tableColumn = ["Nombre", "Código", "Stock", "Unidad", "Estado"];
    const tableRows = productos.map((p) => [
      p.nombre,
      p.codigo || "-",
      p.stock,
      p.unidadMedida,
      p.activo ? "Activo" : "Inactivo",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("Listado_Productos.pdf");
  };

  const columns = [
    { id: "nombre", label: "Producto" },
    { id: "codigo", label: "Código", render: (row) => row.codigo || "---" },
    {
      id: "stock",
      label: "Stock",
      render: (row) => (
        <Typography
          fontWeight="bold"
          color={row.stock <= row.stockMinimo ? "error.main" : "success.main"}
        >
          {row.stock} {row.unidadMedida}
        </Typography>
      ),
    },
    {
      id: "activo",
      label: "Estado",
      render: (row) => (
        <Chip
          label={row.activo ? "Activo" : "Inactivo"}
          color={row.activo ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
  ];

  if (loading)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 3,
          fontWeight: "bold",
          borderLeft: "5px solid",
          borderColor: "primary.main",
          pl: 2,
        }}
      >
        Gestión de Productos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <GenericTable
        columns={columns}
        data={productos}
        searchPlaceholder="Buscar producto..."
        actions={{
          onAdd: () => navigate("/productos/registrar"),
          onExportExcel: handleExportExcel,
          onExportPDF: handleExportPDF,
          onView: (row) => navigate(`/productos/detalle/${row.id}`),
          onEdit: (row) => navigate(`/productos/modificar/${row.id}`),
          onDelete: handleDelete,
        }}
      />
    </Box>
  );
};

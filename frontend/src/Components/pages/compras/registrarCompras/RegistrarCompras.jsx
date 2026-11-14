import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

export const RegistrarCompras = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([
    { id: Date.now(), nombre: "", cantidad: 0, precio: 0 },
  ]);
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    isError: false,
  });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/proveedores").then((res) => res.json()),
      fetch("http://localhost:3000/api/productos").then((res) => res.json()),
    ])
      .then(([proveedoresData, productosData]) => {
        setProveedores(proveedoresData);
        setProductosDisponibles(productosData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        setLoading(false);
      });
  }, []);

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productos];
    if (field === "cantidad" || field === "precio") {
      if (value === "") {
        nuevosProductos[index][field] = value;
      } else {
        const numericValue = parseFloat(value);
        nuevosProductos[index][field] = numericValue < 0 ? 0 : numericValue;
      }
    } else {
      nuevosProductos[index][field] = value;
    }
    setProductos(nuevosProductos);
  };

  const agregarProducto = () => {
    setProductos([
      ...productos,
      { id: Date.now(), nombre: "", cantidad: 0, precio: 0 },
    ]);
  };

  const eliminarProducto = (index) => {
    if (productos.length > 1) {
      const nuevosProductos = [...productos];
      nuevosProductos.splice(index, 1);
      setProductos(nuevosProductos);
    }
  };

  const calcularTotal = () => {
    return productos
      .reduce((acc, p) => acc + p.cantidad * p.precio, 0)
      .toFixed(2);
  };

  const handleCloseDialog = () => {
    const success = !dialog.isError;
    setDialog({ ...dialog, open: false });
    if (success) {
      navigate("/compras/listaCompras");
    }
  };

  const handleCancelar = () => {
    navigate("/compras/listaCompras");
  };

  const registrarCompraEnBackend = () => {
    if (!proveedor || !fecha) {
      setDialog({
        open: true,
        title: "Faltan datos",
        message: "Por favor selecciona un proveedor y una fecha.",
        isError: true,
      });
      return;
    }
    for (const p of productos) {
      if (!p.nombre || p.cantidad <= 0 || p.precio <= 0) {
        setDialog({
          open: true,
          title: "Datos inválidos",
          message:
            "Revise que todos los productos tengan nombre, cantidad y precio.",
          isError: true,
        });
        return;
      }
    }
    const datosCompra = {
      proveedor: proveedor,
      fecha: fecha,
      productos: productos.map((p) => ({
        nombre: p.nombre,
        cantidad: parseFloat(p.cantidad),
        precio: parseFloat(p.precio),
      })),
    };

    fetch("http://localhost:3000/api/compras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosCompra),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `Error: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setDialog({
          open: true,
          title: "¡Compra Registrada!",
          message: "La compra se ha guardado exitosamente.",
          isError: false,
        });
      })
      .catch((error) => {
        setDialog({
          open: true,
          title: "Error",
          message: error.message,
          isError: true,
        });
      });
  };

  if (loading) {
    return (
      <>
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
        >
          <Skeleton variant="text" width="40%" height={60} />
          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <Skeleton variant="rectangular" width="60%" height={56} />
            <Skeleton variant="rectangular" width="30%" height={56} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Paper>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Registrar compra" onBack={() => navigate(-1)} />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
        {/* --- FORMULARIO SUPERIOR --- */}
        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <FormControl fullWidth>
              <InputLabel>Proveedor</InputLabel>
              <Select
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                label="Proveedor"
                fullWidth
              >
                <MenuItem value="">Seleccionar proveedor</MenuItem>
                {proveedores.map((prov) => (
                  <MenuItem key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Fecha de Compra"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>

        {/* --- TABLA DE PRODUCTOS --- */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Detalle de Productos
          </Typography>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "35%",
                    }}
                  >
                    Producto
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                    }}
                  >
                    Cantidad
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                    }}
                  >
                    Precio Unit.
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                    }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "10%",
                      textAlign: "center",
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((p, index) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          displayEmpty
                          value={p.nombre}
                          onChange={(e) =>
                            handleProductoChange(
                              index,
                              "nombre",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            Seleccionar...
                          </MenuItem>
                          {productosDisponibles.map((prod) => (
                            <MenuItem key={prod.id} value={prod.nombre}>
                              {prod.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={p.cantidad}
                        onChange={(e) =>
                          handleProductoChange(
                            index,
                            "cantidad",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={p.precio}
                        onChange={(e) =>
                          handleProductoChange(index, "precio", e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: "text.primary" }}
                      >
                        ${(p.cantidad * p.precio).toFixed(2)}
                      </Typography>
                    </TableCell>

                    {/* AQUI ESTA EL ÍCONO DEL TACHO */}
                    <TableCell align="center">
                      <Tooltip title="Eliminar producto">
                        <IconButton onClick={() => eliminarProducto(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* --- BOTÓN AGREGAR --- */}
        <Button
          startIcon={<AddIcon />}
          onClick={agregarProducto}
          fullWidth
          sx={{
            height: "48px",
            borderRadius: 2,
            mb: 4,
          }}
        >
          Agregar otro producto
        </Button>

        {/* --- FOOTER: TOTAL Y ACCIONES --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 4,
            pt: 3,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {/* Total */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mr: "auto" }}
          >
            <Typography variant="h6" color="text.secondary">
              Total a Pagar:
            </Typography>
            <Typography variant="h4" fontWeight={600} color="primary.main">
              ${calcularTotal()}
            </Typography>
          </Box>

          {/* Botonera (Corregida) */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancelar}
              sx={{
                px: 3,
                py: 1,
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={registrarCompraEnBackend}
              sx={{
                px: 6,
                py: 1,
              }}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* --- DIALOGOS MODALES --- */}
      <Dialog
        open={dialog.open}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { borderRadius: 2, padding: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {dialog.isError ? (
            <ErrorOutlineIcon fontSize="large" sx={{ color: "error.main" }} />
          ) : (
            <CheckCircleOutlineIcon
              fontSize="large"
              sx={{ color: "success.main" }}
            />
          )}
          {dialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            {dialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

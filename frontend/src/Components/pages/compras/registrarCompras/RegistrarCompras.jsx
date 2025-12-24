import React, { useState, useEffect } from "react";
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
  const theme = useTheme();
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
      <Box sx={{ padding: 3, width: "100%", margin: "0 auto" }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <Skeleton variant="rectangular" width="60%" height={56} />
            <Skeleton variant="rectangular" width="30%" height={56} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Paper>
      </Box>
    );
  }

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
        {/* TÍTULO */}
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
          Registrar Nueva Compra
        </Typography>

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
                sx={{ bgcolor: theme.palette.background.default }}
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
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
        </Grid>

        {/* --- TABLA DE PRODUCTOS --- */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.text.secondary,
              fontWeight: "bold",
            }}
          >
            Detalle de Productos
          </Typography>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.background.paper }}>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "35%",
                      fontWeight: "bold",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Producto
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      fontWeight: "bold",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Cantidad
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      fontWeight: "bold",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Precio Unit.
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      fontWeight: "bold",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "10%",
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
                          sx={{ bgcolor: theme.palette.background.default }}
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
                        sx={{ bgcolor: theme.palette.background.default }}
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
                        sx={{ bgcolor: theme.palette.background.default }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        ${(p.cantidad * p.precio).toFixed(2)}
                      </Typography>
                    </TableCell>

                    {/* AQUI ESTA EL ÍCONO DEL TACHO */}
                    <TableCell align="center">
                      <Tooltip title="Eliminar producto">
                        <IconButton
                          onClick={() => eliminarProducto(index)}
                          sx={{
                            color: theme.palette.text.secondary,

                            backgroundColor:
                              theme.palette.background.trasparent,
                            "&:hover": {
                              color: theme.palette.error.main,

                              backgroundColor:
                                theme.palette.background.trasparent,
                            },
                          }}
                        >
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
            border: `1px dashed ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.trasparent,
            fontWeight: "600",
            borderRadius: 2,
            mb: 4,
            "&:hover": {
              border: `1px solid ${theme.palette.primary.main}`,
              backgroundColor: `${theme.palette.primary.main}10`,
            },
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
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Total */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mr: "auto" }}
          >
            <Typography variant="h6" color="text.secondary">
              Total a Pagar:
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              ${calcularTotal()}
            </Typography>
          </Box>

          {/* Botonera (Corregida) */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancelar}
              sx={{
                color: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.trasparent,
                px: 3,
                py: 1,
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.trasparent,
                },
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={registrarCompraEnBackend}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: "bold",
                boxShadow: "none",
                px: 6,
                py: 1,
                "&:hover": {
                  bgcolor:
                    theme.palette.primary.hover || theme.palette.primary.dark,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
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
            <ErrorOutlineIcon
              fontSize="large"
              sx={{ color: theme.palette.error.main }}
            />
          ) : (
            <CheckCircleOutlineIcon
              fontSize="large"
              sx={{ color: theme.palette.accent.green }}
            />
          )}
          <span
            style={{
              color: dialog.isError
                ? theme.palette.error.main
                : theme.palette.accent.green,
            }}
          >
            {dialog.title}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.secondary }}>
            {dialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            autoFocus
            sx={{
              bgcolor: dialog.isError
                ? theme.palette.error.main
                : theme.palette.primary.main,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

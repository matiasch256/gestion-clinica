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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export const RegistrarCompras = () => {
  const [productos, setProductos] = useState([
    { id: Date.now(), nombre: "", cantidad: 0, precio: 0 },
  ]);
  const [proveedor, setProveedor] = useState("");
  const [fecha, setFecha] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const registrarCompraEnBackend = () => {
    if (!proveedor || !fecha) {
      alert("Debes seleccionar un proveedor y una fecha.");
      return;
    }

    for (const p of productos) {
      if (
        !p.nombre ||
        p.cantidad === "" ||
        p.cantidad === null ||
        isNaN(p.cantidad) ||
        p.cantidad <= 0 ||
        p.precio === "" ||
        p.precio === null ||
        isNaN(p.precio) ||
        p.precio <= 0
      ) {
        alert(
          "Todos los productos deben tener nombre, cantidad mayor a 0 y precio mayor a 0."
        );
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCompra),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert("Compra registrada exitosamente");
        setProductos([{ id: Date.now(), nombre: "", cantidad: 0, precio: 0 }]);
        setProveedor("");
        setFecha("");
      })
      .catch((error) => {
        alert("Hubo un error al intentar registrar la compra");
      });
  };

  const handleProveedorChange = (event) => {
    setProveedor(event.target.value);
  };

  const handleFechaChange = (event) => {
    setFecha(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          <Skeleton variant="text" width="30%" />
        </Typography>
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Skeleton variant="rectangular" width={200} height={56} />
          <Skeleton variant="rectangular" width={200} height={56} />
        </Box>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="20%" />
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="rectangular" width="90%" height={56} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width="60%" height={56} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width="60%" height={56} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width="60%" height={56} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: "large",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Registrar Compra
      </Typography>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={proveedor}
            onChange={handleProveedorChange}
            label="Proveedor"
            sx={{ height: 56 }}
          >
            <MenuItem value="">Seleccionar proveedor</MenuItem>
            {proveedores.map((prov) => (
              <MenuItem key={prov.id} value={prov.id}>
                {prov.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={handleFechaChange}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 200, "& .MuiInputBase-root": { height: 56 } }}
        />
      </Box>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Productos
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "35%" }}>Nombre</TableCell>
              <TableCell sx={{ width: "20%" }}>Cantidad</TableCell>
              <TableCell sx={{ width: "20%" }}>Precio Unitario</TableCell>
              <TableCell sx={{ width: "15%" }}>Subtotal</TableCell>
              <TableCell sx={{ width: "10%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((p, index) => (
              <TableRow key={p.id}>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Producto</InputLabel>
                    <Select
                      value={p.nombre}
                      onChange={(e) =>
                        handleProductoChange(index, "nombre", e.target.value)
                      }
                      label="Producto"
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="">Seleccionar producto</MenuItem>
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
                    type="numeric"
                    value={p.cantidad}
                    onChange={(e) =>
                      handleProductoChange(index, "cantidad", e.target.value)
                    }
                    sx={{ "& .MuiInputBase-root": { height: 56 } }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="numeric"
                    value={p.precio}
                    onChange={(e) =>
                      handleProductoChange(index, "precio", e.target.value)
                    }
                    sx={{ "& .MuiInputBase-root": { height: 56 } }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>${(p.cantidad * p.precio).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => eliminarProducto(index)}
                    sx={{
                      height: 50,
                      mb: 1,
                      borderColor: "#d32f2f !important",
                      color: "#d32f2f !important",
                      backgroundColor: "transparent !important",
                      "&:hover": {
                        borderColor: "#b71c1c !important",
                        backgroundColor: "rgba(211, 47, 47, 0.04) !important",
                      },
                    }}
                    size="small"
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={agregarProducto}
          sx={{
            height: 50,
            mr: 1,
            mb: 1,
            borderColor: "#1976d2 !important",
            color: "#1976d2 !important",
            backgroundColor: "transparent !important",
            "&:hover": {
              borderColor: "#115293 !important",
              backgroundColor: "rgba(25, 118, 210, 0.04) !important",
            },
          }}
        >
          Agregar Producto
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" component="span">
            Total: ${calcularTotal()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={registrarCompraEnBackend}
            sx={{
              height: 50,
              backgroundColor: "#1976d2 !important",
              "&:hover": { backgroundColor: "#115293 !important" },
              color: "#fff !important",
            }}
          >
            Registrar Compra
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

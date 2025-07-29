import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ModificarCompra() {
  const { idCompra } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [errorState, setErrorState] = useState({
    proveedor: false,
    fecha: false,
    productos: [],
  });

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3000/api/compras/${idCompra}`).then((res) =>
        res.json()
      ),
      fetch("http://localhost:3000/proveedores").then((res) => res.json()),
      fetch("http://localhost:3000/api/productos").then((res) => res.json()),
    ])
      .then(([compraData, proveedoresData, productosData]) => {
        setCompra(compraData);
        setProveedores(proveedoresData);
        setProductosDisponibles(productosData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        setLoading(false);
      });
  }, [idCompra]);

  const handleChangeProducto = (index, field, value) => {
    const nuevosProductos = [...compra.productos];

    if (field === "Cantidad" || field === "Precio") {
      if (value === "") {
        nuevosProductos[index][field] = "";
      } else {
        const numero = parseFloat(value);
        nuevosProductos[index][field] = numero < 0 ? 0 : numero;
      }
    } else {
      nuevosProductos[index][field] = value;
    }

    setCompra({ ...compra, productos: nuevosProductos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrorState = {
      proveedor: !compra.proveedor,
      fecha: !compra.fecha,
      productos: compra.productos.map(
        (p) => Number(p.Cantidad) === 0 || Number(p.Precio) === 0
      ),
    };

    if (
      newErrorState.proveedor ||
      newErrorState.fecha ||
      newErrorState.productos.some((error) => error)
    ) {
      setErrorState(newErrorState);
      if (newErrorState.proveedor || newErrorState.fecha) {
        alert("Debes seleccionar un proveedor y una fecha.");
      } else {
        alert("La cantidad y el precio deben ser mayores a 0.");
      }
      return;
    }

    setErrorState({ proveedor: false, fecha: false, productos: [] });

    try {
      const response = await fetch(
        `http://localhost:3000/api/compras/${idCompra}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compra),
        }
      );

      if (response.ok) {
        alert("Compra actualizada correctamente");
        navigate("/compras/listaCompras");
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading || !compra) {
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Skeleton variant="rectangular" width={120} height={36} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: 1200,
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
        Editar Compra N° {compra.id}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ minWidth: 200 }} error={errorState.proveedor}>
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={compra.proveedor || ""}
              onChange={(e) =>
                setCompra({ ...compra, proveedor: parseInt(e.target.value) })
              }
              label="Proveedor"
              sx={{ height: 56 }}
            >
              {proveedores.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre}
                </MenuItem>
              ))}
            </Select>
            {errorState.proveedor && (
              <Typography color="error" variant="caption">
                Seleccione un proveedor
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Fecha"
            type="date"
            name="fecha"
            value={compra.fecha?.split("T")[0] || ""}
            onChange={(e) => setCompra({ ...compra, fecha: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 200, "& .MuiInputBase-root": { height: 56 } }}
            error={errorState.fecha}
            helperText={errorState.fecha ? "Seleccione una fecha" : ""}
          />

          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, mt: 2, display: "block", width: "100%" }}
          >
            Productos
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "40%" }}>Nombre</TableCell>
                  <TableCell sx={{ width: "30%" }}>Cantidad</TableCell>
                  <TableCell sx={{ width: "30%" }}>Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {compra.productos.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel>Producto</InputLabel>
                        <Select
                          value={p.idProducto || ""}
                          onChange={(e) =>
                            handleChangeProducto(
                              i,
                              "idProducto",
                              parseInt(e.target.value)
                            )
                          }
                          label="Producto"
                          sx={{ height: 56 }}
                        >
                          {productosDisponibles.map((prod) => (
                            <MenuItem key={prod.id} value={prod.id}>
                              {prod.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="numeric"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={p.Cantidad}
                        onChange={(e) =>
                          handleChangeProducto(i, "Cantidad", e.target.value)
                        }
                        sx={{ "& .MuiInputBase-root": { height: 56 } }}
                        fullWidth
                        error={errorState.productos[i]}
                        helperText={
                          errorState.productos[i] ? "Debe ser mayor a 0" : ""
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="numeric"
                        value={p.Precio}
                        onChange={(e) =>
                          handleChangeProducto(i, "Precio", e.target.value)
                        }
                        sx={{ "& .MuiInputBase-root": { height: 56 } }}
                        fullWidth
                        error={errorState.productos[i]}
                        helperText={
                          errorState.productos[i] ? "Debe ser mayor a 0" : ""
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

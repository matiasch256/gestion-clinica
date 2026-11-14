import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import { useFeedback } from "../../../../context/FeedbackProvider";
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
  Grid,
  Divider,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function ModificarCompra() {
  const { idCompra } = useParams();
  const navigate = useNavigate();
  const { notify } = useFeedback();

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
        notify("Debes seleccionar un proveedor y una fecha.", "warning");
      } else {
        notify("La cantidad y el precio deben ser mayores a 0.", "warning");
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
        notify("Compra actualizada correctamente");
        navigate("/compras/listaCompras");
      } else {
        notify("Error al actualizar", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading || !compra) {
    return (
      <>
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
        >
          <Skeleton variant="text" width="40%" height={60} />
          <Grid container spacing={3} sx={{ my: 3 }}>
            <Grid size={{ xs: 8 }}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          </Grid>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Paper>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={<>Editar Compra N° {compra.id}</>}
        onBack={() => navigate(-1)}
      />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <FormControl fullWidth error={errorState.proveedor}>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={compra.proveedor || ""}
                  onChange={(e) =>
                    setCompra({
                      ...compra,
                      proveedor: parseInt(e.target.value),
                    })
                  }
                  label="Proveedor"
                >
                  {proveedores.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errorState.proveedor && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ ml: 2, mt: 0.5 }}
                  >
                    Seleccione un proveedor
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Fecha"
                type="date"
                name="fecha"
                value={compra.fecha?.split("T")[0] || ""}
                onChange={(e) =>
                  setCompra({ ...compra, fecha: e.target.value })
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                error={errorState.fecha}
                helperText={errorState.fecha ? "Seleccione una fecha" : ""}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          <Box sx={{ width: "100%", mb: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ReceiptLongIcon /> Productos
            </Typography>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: "40%",
                      }}
                    >
                      Nombre
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "30%",
                      }}
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "30%",
                      }}
                    >
                      Precio
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compra.productos.map((p, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={p.idProducto || ""}
                            onChange={(e) =>
                              handleChangeProducto(
                                i,
                                "idProducto",
                                parseInt(e.target.value)
                              )
                            }
                            displayEmpty
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
                          type="number"
                          size="small"
                          value={p.Cantidad}
                          onChange={(e) =>
                            handleChangeProducto(i, "Cantidad", e.target.value)
                          }
                          fullWidth
                          error={errorState.productos[i]}
                          helperText={
                            errorState.productos[i] ? "Debe ser mayor a 0" : ""
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={p.Precio}
                          onChange={(e) =>
                            handleChangeProducto(i, "Precio", e.target.value)
                          }
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
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/compras/listaCompras")}
              sx={{
                px: 3,
                py: 1,
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                px: 4,
                py: 1,
              }}
            >
              Guardar
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
}

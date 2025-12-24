import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import InventoryIcon from "@mui/icons-material/Inventory";
import EditIcon from "@mui/icons-material/Edit";

export function ModificarProducto() {
  const theme = useTheme();
  const { idProducto } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    codigo: "",
    unidadMedida: "",
    stock: "",
    stockMinimo: "",
    observaciones: "",
    categoriaId: "",
    activo: true,
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`http://localhost:3000/api/productos/${idProducto}`),
          fetch("http://localhost:3000/api/categorias"),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodRes.ok) {
          setProducto(prodData);
        } else {
          mostrarMensaje("Error al cargar el producto", "error");
        }

        if (catRes.ok) {
          setCategorias(catData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        mostrarMensaje("Error de conexión", "error");
        setLoading(false);
      }
    };

    fetchData();
  }, [idProducto]);

  const mostrarMensaje = (mensaje, severidad) => {
    setSnackbar({ open: true, message: mensaje, severity: severidad });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const valorFinal = name === "activo" ? value === "true" : value;

    setProducto({ ...producto, [name]: valorFinal });

    if (errores[name]) {
      setErrores({ ...errores, [name]: false });
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!producto.nombre?.trim()) nuevosErrores.nombre = true;
    if (!producto.descripcion?.trim()) nuevosErrores.descripcion = true;
    if (!producto.codigo?.trim()) nuevosErrores.codigo = true;
    if (!producto.unidadMedida?.trim()) nuevosErrores.unidadMedida = true;

    if (
      producto.stock === "" ||
      isNaN(producto.stock) ||
      Number(producto.stock) < 0
    )
      nuevosErrores.stock = true;

    if (
      producto.stockMinimo === "" ||
      isNaN(producto.stockMinimo) ||
      Number(producto.stockMinimo) <= 0
    )
      nuevosErrores.stockMinimo = true;

    if (!producto.categoriaId) nuevosErrores.categoriaId = true;

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      mostrarMensaje("Por favor completa los campos marcados.", "error");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/productos/${idProducto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        }
      );

      if (res.ok) {
        mostrarMensaje("Producto actualizado correctamente", "success");
        setTimeout(() => navigate("/productos/lista"), 1500);
      } else {
        mostrarMensaje("Error al actualizar el producto", "error");
      }
    } catch (error) {
      console.error("Error al enviar la actualización:", error);
      mostrarMensaje("Error de red al actualizar", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          </Grid>
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
          Editar Producto
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.nombre}
                helperText={errores.nombre ? "Campo obligatorio" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Código"
                name="codigo"
                value={producto.codigo}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.codigo}
                helperText={errores.codigo ? "Campo obligatorio" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={errores.categoriaId}>
                <InputLabel id="cat-label">Categoría</InputLabel>
                <Select
                  labelId="cat-label"
                  name="categoriaId"
                  value={producto.categoriaId}
                  label="Categoría"
                  onChange={handleChange}
                  sx={{ bgcolor: theme.palette.background.default }}
                >
                  <MenuItem value="">
                    <em>Seleccione una categoría</em>
                  </MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errores.categoriaId && (
                  <FormHelperText>Seleccione una categoría</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="activo-label">Estado</InputLabel>
                <Select
                  labelId="activo-label"
                  name="activo"
                  value={producto.activo ? "true" : "false"}
                  label="Estado"
                  onChange={handleChange}
                  sx={{ bgcolor: theme.palette.background.default }}
                >
                  <MenuItem value="true">Activo</MenuItem>
                  <MenuItem value="false">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.descripcion}
                helperText={errores.descripcion ? "Campo obligatorio" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Observaciones"
                name="observaciones"
                value={producto.observaciones || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                  mb: 1,
                  color: theme.palette.text.secondary,
                }}
              >
                <InventoryIcon />
                <Typography variant="h6" fontWeight="bold">
                  Inventario
                </Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Unidad de Medida"
                name="unidadMedida"
                value={producto.unidadMedida}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.unidadMedida}
                helperText={errores.unidadMedida ? "Campo obligatorio" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Stock Actual"
                name="stock"
                type="number"
                value={producto.stock}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.stock}
                helperText={errores.stock ? "Debe ser >= 0" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Stock Mínimo"
                name="stockMinimo"
                type="number"
                value={producto.stockMinimo}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.stockMinimo}
                helperText={errores.stockMinimo ? "Debe ser > 0" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={() => navigate(-1)}
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
              type="submit"
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: "bold",
                boxShadow: "none",
                px: 4,
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
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontWeight: "bold",
            "& .MuiAlert-action": {
              "& .MuiIconButton-root": {
                backgroundColor: theme.palette.background.trasparent,
                color: "inherit",
                "&:hover": {
                  backgroundColor: theme.palette.background.trasparent,
                },
              },
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ModificarProducto;

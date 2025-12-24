import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import InventoryIcon from "@mui/icons-material/Inventory";
import QrCodeIcon from "@mui/icons-material/QrCode";

const UNIDADES_MEDIDA = [
  "Unidad",
  "Kilogramo (kg)",
  "Litro (L)",
  "Metro (m)",
  "Caja",
  "Pack",
  "Bolsa",
];

export const RegistrarProducto = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [errores, setErrores] = useState({
    nombre: false,
    codigo: false,
    descripcion: false,
    unidadMedida: false,
    stock: false,
    stockMinimo: false,
    categoriaSeleccionada: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
        mostrarMensaje("Error al cargar las categorías", "error");
      });
  }, []);

  const mostrarMensaje = (mensaje, severidad) => {
    setSnackbar({
      open: true,
      message: mensaje,
      severity: severidad,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const validarCampos = () => {
    const stockNum = parseInt(stock);
    const stockMinimoNum = parseInt(stockMinimo);

    let nuevosErrores = {
      nombre: !nombre.trim(),
      codigo: !codigo.trim(),
      descripcion: !descripcion.trim(),
      unidadMedida: !unidadMedida,
      stock: isNaN(stockNum) || stockNum < 0,
      stockMinimo: isNaN(stockMinimoNum) || stockMinimoNum <= 0,
      categoriaSeleccionada: !categoriaSeleccionada,
    };

    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some((error) => error);
  };

  const registrarProducto = () => {
    if (!validarCampos()) {
      mostrarMensaje(
        "Por favor completa los campos marcados en rojo.",
        "error"
      );
      return;
    }

    const nuevoProducto = {
      nombre,
      codigo,
      descripcion,
      unidadMedida,
      stock: parseInt(stock),
      stockMinimo: parseInt(stockMinimo),
      categoriaId: categoriaSeleccionada,
    };

    fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        mostrarMensaje("Producto registrado exitosamente", "success");

        setNombre("");
        setCodigo("");
        setDescripcion("");
        setUnidadMedida("");
        setStock("");
        setStockMinimo("");
        setCategoriaSeleccionada("");
        setErrores({
          nombre: false,
          codigo: false,
          descripcion: false,
          unidadMedida: false,
          stock: false,
          stockMinimo: false,
          categoriaSeleccionada: false,
        });

        setTimeout(() => {
          navigate("/productos/lista");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error al registrar producto:", error);
        mostrarMensaje("Hubo un error al registrar el producto", "error");
      });
  };

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
          Registrar Producto
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              label="Nombre del Producto"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrores((prev) => ({ ...prev, nombre: false }));
              }}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              error={errores.nombre}
              helperText={errores.nombre ? "Campo obligatorio" : ""}
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Código / SKU"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value);
                setErrores((prev) => ({ ...prev, codigo: false }));
              }}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              error={errores.codigo}
              helperText={errores.codigo ? "Campo obligatorio" : ""}
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={errores.categoriaSeleccionada}>
              <InputLabel id="cat-label">Categoría</InputLabel>
              <Select
                labelId="cat-label"
                value={categoriaSeleccionada}
                label="Categoría"
                onChange={(e) => {
                  setCategoriaSeleccionada(e.target.value);
                  setErrores((prev) => ({
                    ...prev,
                    categoriaSeleccionada: false,
                  }));
                }}
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
              {errores.categoriaSeleccionada && (
                <FormHelperText>Seleccione una categoría</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setErrores((prev) => ({ ...prev, descripcion: false }));
              }}
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
                Datos de Inventario
              </Typography>
            </Box>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={errores.unidadMedida}>
              <InputLabel id="unidad-label">Unidad de Medida</InputLabel>
              <Select
                labelId="unidad-label"
                value={unidadMedida}
                label="Unidad de Medida"
                onChange={(e) => {
                  setUnidadMedida(e.target.value);
                  setErrores((prev) => ({ ...prev, unidadMedida: false }));
                }}
                sx={{ bgcolor: theme.palette.background.default }}
              >
                <MenuItem value="">
                  <em>Seleccionar...</em>
                </MenuItem>
                {UNIDADES_MEDIDA.map((unidad) => (
                  <MenuItem key={unidad} value={unidad}>
                    {unidad}
                  </MenuItem>
                ))}
              </Select>
              {errores.unidadMedida && (
                <FormHelperText>Seleccione una unidad</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Stock Inicial"
              type="number"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                setErrores((prev) => ({ ...prev, stock: false }));
              }}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              error={errores.stock}
              helperText={errores.stock ? "Número válido requerido" : ""}
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Stock Mínimo"
              type="number"
              value={stockMinimo}
              onChange={(e) => {
                setStockMinimo(e.target.value);
                setErrores((prev) => ({ ...prev, stockMinimo: false }));
              }}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              error={errores.stockMinimo}
              helperText={errores.stockMinimo ? "Mayor a 0" : ""}
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
            onClick={() => navigate("/productos/lista")}
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
            onClick={registrarProducto}
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
};

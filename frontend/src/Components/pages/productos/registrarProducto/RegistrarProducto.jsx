import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import InventoryIcon from "@mui/icons-material/Inventory";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useFeedback } from "../../../../context/FeedbackProvider";

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

  const { notify: mostrarMensaje } = useFeedback();

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
  }, [mostrarMensaje]);

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
      .then(() => {
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
    <>
      <PageHeader title="Registrar Producto" onBack={() => navigate(-1)} />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
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
                color: "text.secondary",
              }}
            >
              <InventoryIcon />
              <Typography variant="h6" fontWeight={600}>
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
            color="inherit"
            onClick={() => navigate("/productos/lista")}
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
            onClick={registrarProducto}
            sx={{
              px: 4,
              py: 1,
            }}
          >
            Guardar
          </Button>
        </Box>
      </Paper>
    </>
  );
};

import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Skeleton,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import InventoryIcon from "@mui/icons-material/Inventory";
import EditIcon from "@mui/icons-material/Edit";
import { useFeedback } from "../../../../context/FeedbackProvider";

export function ModificarProducto() {
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

  const { notify: mostrarMensaje } = useFeedback();

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
  }, [idProducto, mostrarMensaje]);

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
      <>
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
        >
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
      </>
    );
  }

  return (
    <>
      <PageHeader title="Editar Producto" onBack={() => navigate(-1)} />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
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
                sx={{ bgcolor: "background.paper" }}
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
                sx={{ bgcolor: "background.paper" }}
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
              onClick={() => navigate(-1)}
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

export default ModificarProducto;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
  Skeleton,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";

export const ActualizarProveedor = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(true);

  const [errores, setErrores] = useState({
    nombre: false,
    direccion: false,
    barrio: false,
    telefono: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/proveedores/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener proveedor");
        return res.json();
      })
      .then((data) => {
        setNombre(data.nombre);
        setDireccion(data.direccion);
        setBarrio(data.barrio);
        setTelefono(data.telefono);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        mostrarMensaje("Error al cargar los datos del proveedor", "error");
        setCargando(false);
      });
  }, [id, navigate]);

  const mostrarMensaje = (mensaje, severidad) => {
    setSnackbar({ open: true, message: mensaje, severity: severidad });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const validarCampos = () => {
    let nuevosErrores = {
      nombre: !nombre.trim() || !isNaN(nombre),
      direccion: !direccion.trim(),
      barrio: !barrio.trim(),
      telefono: !telefono.trim(),
    };
    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some((error) => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      mostrarMensaje("Por favor revisa los campos marcados.", "error");
      return;
    }

    fetch(`http://localhost:3000/proveedores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, direccion, barrio, telefono }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar proveedor");
        mostrarMensaje("Proveedor actualizado con éxito", "success");
        setTimeout(() => navigate("/proveedores/consultar"), 1500);
      })
      .catch((err) => mostrarMensaje(err.message, "error"));
  };

  if (cargando) {
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
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Actualizar Proveedor
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrores({ ...errores, nombre: false });
                }}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.nombre}
                helperText={errores.nombre ? "Nombre inválido" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Teléfono"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  setErrores({ ...errores, telefono: false });
                }}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.telefono}
                helperText={errores.telefono ? "Campo obligatorio" : ""}
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
                <LocationOnIcon />
                <Typography variant="h6" fontWeight="bold">
                  Ubicación
                </Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Dirección"
                value={direccion}
                onChange={(e) => {
                  setDireccion(e.target.value);
                  setErrores({ ...errores, direccion: false });
                }}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.direccion}
                helperText={errores.direccion ? "Campo obligatorio" : ""}
                sx={{ bgcolor: theme.palette.background.default }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Barrio"
                value={barrio}
                onChange={(e) => {
                  setBarrio(e.target.value);
                  setErrores({ ...errores, barrio: false });
                }}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.barrio}
                helperText={errores.barrio ? "Campo obligatorio" : ""}
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
              onClick={() => navigate("/proveedores/consultar")}
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
              Actualizar
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
};

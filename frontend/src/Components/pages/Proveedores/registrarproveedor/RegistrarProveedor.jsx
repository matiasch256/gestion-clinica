import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const RegistrarProveedor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editandoId, setEditandoId] = useState(null);

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
    const proveedor = location.state?.proveedor;

    if (proveedor) {
      setNombre(proveedor.nombre);
      setDireccion(proveedor.direccion);
      setBarrio(proveedor.barrio);
      setTelefono(proveedor.telefono);
      setEditandoId(proveedor.id);
    } else if (location.pathname === "/proveedores/actualizar") {
      mostrarMensaje("No se encontró ningún proveedor para editar.", "warning");
      setTimeout(() => navigate("/proveedores/consultar"), 2000);
    }
  }, [location, navigate]);

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

    const url = editandoId
      ? `http://localhost:3000/proveedores/${editandoId}`
      : "http://localhost:3000/proveedores";
    const method = editandoId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, direccion, barrio, telefono }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar proveedor");
        return res.json();
      })
      .then(() => {
        mostrarMensaje(
          editandoId
            ? "Proveedor actualizado correctamente"
            : "Proveedor registrado correctamente",
          "success"
        );

        setNombre("");
        setDireccion("");
        setBarrio("");
        setTelefono("");
        setErrores({
          nombre: false,
          direccion: false,
          barrio: false,
          telefono: false,
        });

        setTimeout(() => navigate("/proveedores/consultar"), 1500);
      })
      .catch((err) => mostrarMensaje(err.message, "error"));
  };

  return (
    <>
      <PageHeader
        title={editandoId ? "Editar Proveedor" : "Registrar Proveedor"}
        onBack={() => navigate(-1)}
      />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre del Proveedor"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrores({ ...errores, nombre: false });
                }}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                error={errores.nombre}
                helperText={errores.nombre ? "Nombre inválido o vacío" : ""}
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
                <LocationOnIcon />
                <Typography variant="h6" fontWeight={600}>
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
              onClick={() => navigate("/proveedores/consultar")}
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
            fontWeight: 600,
            "& .MuiAlert-action": {
              "& .MuiIconButton-root": {
                backgroundColor: "transparent",
                color: "inherit",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

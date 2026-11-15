import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import { useFeedback } from "../../../../context/FeedbackProvider";

export const ActualizarProveedor = () => {
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

  const { notify: mostrarMensaje } = useFeedback();

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
  }, [id, navigate, mostrarMensaje]);

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
      <PageHeader title="Actualizar Proveedor" onBack={() => navigate(-1)} />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
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
              Actualizar
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

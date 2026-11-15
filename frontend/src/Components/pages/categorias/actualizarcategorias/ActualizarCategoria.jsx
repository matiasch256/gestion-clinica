import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import { useFeedback } from "../../../../context/FeedbackProvider";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Skeleton,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

export const ActualizarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useFeedback();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/categorias/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener categoría");
        return res.json();
      })
      .then((data) => {
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setCargando(false);
      })
      .catch((err) => {
        notify(err.message, "error");
        setCargando(false);
        navigate("/categorias/consultar");
      });
  }, [id, navigate, notify]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      notify("Todos los campos son obligatorios.", "warning");
      return;
    }

    if (!isNaN(nombre)) {
      notify("El nombre no puede ser un número.", "warning");
      return;
    }

    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar categoría");
        notify("Categoría actualizada con éxito");
        navigate("/categorias/consultar");
      })
      .catch((err) => notify(err.message, "error"));
  };

  const handleCancelar = () => {
    navigate("/categorias/consultar");
  };

  return (
    <>
      <PageHeader title="Actualizar Categoría" onBack={() => navigate(-1)} />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
        {cargando ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton variant="rectangular" height={56} width="100%" />
            <Skeleton variant="rectangular" height={100} width="100%" />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Skeleton variant="rectangular" height={36} width={100} />
              <Skeleton variant="rectangular" height={36} width={120} />
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              <Grid
                size={{ xs: 12 }}
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelar}
                  sx={{
                    px: 3,
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
                  }}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </>
  );
};

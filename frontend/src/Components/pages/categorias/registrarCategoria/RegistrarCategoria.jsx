import PageHeader from "../../../common/PageHeader";
import { FORM_MAX_WIDTH } from "../../../../theme/theme";
import { useFeedback } from "../../../../context/FeedbackProvider";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

export const RegistrarCategoria = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const navigate = useNavigate();
  const { notify } = useFeedback();
  const location = useLocation();

  useEffect(() => {
    const categoria = location.state?.categoria;
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
      setEditandoId(categoria.id);
    }
  }, [location]);

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

    const url = editandoId
      ? `http://localhost:3000/api/categorias/${editandoId}`
      : "http://localhost:3000/api/categorias";
    const method = editandoId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar categoría");
        return res.json();
      })
      .then(() => {
        setNombre("");
        setDescripcion("");
        setEditandoId(null);
        notify("Categoría guardada correctamente");
        navigate("/categorias/consultar");
      })
      .catch((err) => notify(err.message, "error"));
  };

  const handleCancelar = () => {
    navigate("/categorias/consultar");
  };

  return (
    <>
      <PageHeader
        title={editandoId ? "Editar Categoría" : "Registrar Categoría"}
        onBack={() => navigate(-1)}
      />
      <Paper
        variant="outlined"
        sx={{ p: 3, borderRadius: 3, maxWidth: FORM_MAX_WIDTH }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                label="Nombre de la Categoría"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Breve descripción de la categoría..."
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
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<CheckIcon />}
              >
                {editandoId ? "Actualizar" : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

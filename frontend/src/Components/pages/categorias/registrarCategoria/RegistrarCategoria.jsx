import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

export const RegistrarCategoria = () => {
  const theme = useTheme();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const navigate = useNavigate();
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
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!isNaN(nombre)) {
      alert("El nombre no puede ser un número.");
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
        alert("Categoría guardada correctamente");
        navigate("/categorias/consultar");
      })
      .catch((err) => alert(err.message));
  };

  const handleCancelar = () => {
    navigate("/categorias/consultar");
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
          maxWidth: 800,
          margin: "0 auto",
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
          {editandoId ? "Editar Categoría" : "Registrar Categoría"}
        </Typography>

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
                sx={{ bgcolor: theme.palette.background.default }}
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
                sx={{ bgcolor: theme.palette.background.default }}
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
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancelar}
                sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.background.trasparent,
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
                  "&:hover": {
                    bgcolor:
                      theme.palette.primary.hover || theme.palette.primary.dark,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {editandoId ? "Actualizar" : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

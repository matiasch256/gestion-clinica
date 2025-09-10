import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  // --- IMPORTS PARA EL FORMULARIO CORREGIDO ---
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const RegistrarCategoria = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    isError: false,
  });

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

  const handleCloseDialog = () => {
    const success = !dialog.isError;
    setDialog({ ...dialog, open: false });
    if (success) {
      navigate("/categorias/consultar"); // Ajusta esta ruta si es necesario
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      setDialog({
        open: true,
        title: "Campos Incompletos",
        message: "Todos los campos son obligatorios.",
        isError: true,
      });
      return;
    }
    if (!isNaN(nombre)) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: "El nombre no puede ser un número.",
        isError: true,
      });
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
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.details || "Error al guardar la categoría");
        }
        return res.json();
      })
      .then(() => {
        const message = editandoId
          ? "Categoría actualizada correctamente."
          : "Categoría registrada correctamente.";
        setDialog({ open: true, title: "¡Éxito!", message, isError: false });
      })
      .catch((err) => {
        setDialog({
          open: true,
          title: "Error",
          message: err.message,
          isError: true,
        });
      });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {editandoId ? "Editar Categoría" : "Registrar Categoría"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3, // Aumentamos un poco el espacio para que respire mejor
          }}
        >
          {/* --- CAMPO "NOMBRE" CORREGIDO --- */}
          <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor="nombre">Nombre de la Categoría</InputLabel>
            <OutlinedInput
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              label="Nombre de la Categoría"
              autoComplete="off"
            />
          </FormControl>

          {/* --- CAMPO "DESCRIPCIÓN" CORREGIDO --- */}
          <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor="descripcion">Descripción</InputLabel>
            <OutlinedInput
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              label="Descripción"
              multiline
              rows={4}
              autoComplete="off"
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            {editandoId ? "Actualizar Categoría" : "Registrar Categoría"}
          </Button>
        </Box>
      </Paper>

      {/* --- Diálogo de Notificación --- */}
      <Dialog open={dialog.open} onClose={handleCloseDialog}>
        {/* ... Tu código del Dialog se mantiene igual ... */}
      </Dialog>
    </Container>
  );
};

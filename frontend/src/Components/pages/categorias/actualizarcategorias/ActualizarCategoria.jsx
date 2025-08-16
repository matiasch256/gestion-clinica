import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

export const ActualizarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        alert(err.message);
        setCargando(false);
        navigate("/categorias/consultar");
      });
  }, [id, navigate]);

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

    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar categoría");
        alert("Categoría actualizada con éxito");
        navigate("/categorias/consultar");
      })
      .catch((err) => alert(err.message));
  };

  if (cargando) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1">
          Cargando datos de la categoría...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Actualizar Categoría
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Actualizar Categoría
        </Button>
      </Box>
    </Box>
  );
};

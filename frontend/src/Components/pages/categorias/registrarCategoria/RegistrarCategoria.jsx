import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

export const RegistrarCategoria = () => {
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

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {editandoId ? "Editar Categoría" : "Registrar Categoría"}
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
          {editandoId ? "Actualizar" : "Registrar"}
        </Button>
      </Box>
    </Box>
  );
};

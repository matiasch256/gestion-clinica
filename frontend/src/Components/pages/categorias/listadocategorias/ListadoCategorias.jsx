import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

export const ListadoCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  const obtenerCategorias = () => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al obtener categorías:", err));
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleEditar = (categoria) => {
    navigate(`/categorias/actualizar/${categoria.id}`);
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar categoría");
        obtenerCategorias();
      })
      .catch((err) => alert(err.message));
  };

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Listado de Categorías
      </Typography>
      <TextField
        label="Buscar por nombre"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriasFiltradas.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.descripcion}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditar(c)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleEliminar(c.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

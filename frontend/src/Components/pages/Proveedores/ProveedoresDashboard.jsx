import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const ProveedoresDashBoard = () => {
  const [total, setTotal] = useState(0);
  const [ultimos, setUltimos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.length);
        setUltimos(data.slice(-5).reverse());
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar proveedores", err);
        setCargando(false);
      });
  }, []);

  if (cargando)
    return (
      <Typography variant="body1">Cargando datos del dashboard...</Typography>
    );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Dashboard de Proveedores
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total de proveedores: <strong>{total}</strong>
      </Typography>
      <Typography variant="h6" gutterBottom>
        Últimos proveedores agregados
      </Typography>
      {ultimos.length > 0 ? (
        <TableContainer component={Paper} sx={{ marginTop: 2, boxShadow: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="últimos proveedores">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ultimos.map((p) => (
                <TableRow
                  key={p.id}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.telefono}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginTop: 2 }}
        >
          No hay últimos proveedores para mostrar.
        </Typography>
      )}
    </Box>
  );
};

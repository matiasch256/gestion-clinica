import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import StockAlertWidget from "../listaProductos/StockAlertWidget";

export const ProductosDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Dashboard de Productos
      </Typography>
      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <StockAlertWidget productos={productos} />
      )}
    </Box>
  );
};

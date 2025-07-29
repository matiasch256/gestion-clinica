import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, // Azul para Buscar y Ver
    secondary: { main: "#dc004e" }, // Rosa para Limpiar Filtros y Exportar a PDF
    success: { main: "#2e7d32" }, // Verde para Exportar a Excel
    warning: { main: "#f57c00" }, // Naranja para Editar
    error: { main: "#d32f2f" }, // Rojo para Eliminar
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);

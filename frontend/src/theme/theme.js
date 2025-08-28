import { createTheme } from "@mui/material/styles";
import palette from "./palette";

export const getTheme = () =>
  createTheme({
    palette: {
      mode: "light", // Fijamos el modo claro
      ...palette, // Usamos directamente la paleta
    },
    typography: {
      fontFamily: "'Roboto', sans-serif !important",
    },
  });

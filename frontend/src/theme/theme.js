import { createTheme } from "@mui/material/styles";
import palette from "./palette";

export const getTheme = () =>
  createTheme({
    palette: {
      mode: "light",
      ...palette,
    },
    typography: {
      fontFamily: "'Roboto', sans-serif !important",
    },
  });

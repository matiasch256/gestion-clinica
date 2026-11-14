import { createTheme } from "@mui/material/styles";
import palette from "./palette";

// Medidas que se repiten en toda la app.
export const RADIUS = { control: 8, card: 12 };
export const PAGE_MAX_WIDTH = 1280;
export const FORM_MAX_WIDTH = 960;

export const getTheme = () =>
  createTheme({
    palette: {
      mode: "light",
      ...palette,
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      // Jerarquía: h5 = título de página, h6 = título de sección,
      // subtitle2 = cabeceras y etiquetas, body2 = texto general.
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600, fontSize: "1.05rem" },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: RADIUS.control },
        },
      },
      MuiTextField: { defaultProps: { size: "small" } },
      MuiFormControl: { defaultProps: { size: "small" } },
      MuiSelect: { defaultProps: { size: "small" } },
      MuiAutocomplete: { defaultProps: { size: "small" } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS.control,
            backgroundColor: palette.background.paper,
          },
        },
      },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: { borderRadius: RADIUS.card },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: RADIUS.card },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottomColor: palette.divider },
          head: {
            fontWeight: 600,
            color: palette.text.secondary,
            backgroundColor: palette.background.subtle,
            whiteSpace: "nowrap",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
      MuiTooltip: { defaultProps: { arrow: true } },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: RADIUS.control },
        },
      },
    },
  });

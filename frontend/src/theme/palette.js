// Paleta única de la aplicación.
// Regla: el azul es el único color de marca. Verde, ámbar, rojo y celeste
// se usan solo para comunicar estados (ok, alerta, error, información).

const primary = {
  lighter: "#e7f0fd",
  light: "#6ea8fe",
  main: "#0b5ed7",
  dark: "#084298",
  contrastText: "#ffffff",
};

const success = {
  lighter: "#e8f5ee",
  light: "#5cb85c",
  main: "#198754",
  dark: "#146c43",
  contrastText: "#ffffff",
};

const warning = {
  lighter: "#fff4e0",
  light: "#f0ad4e",
  main: "#b45309",
  dark: "#8a3f06",
  contrastText: "#ffffff",
};

const error = {
  lighter: "#fdecee",
  light: "#e4606d",
  main: "#dc3545",
  dark: "#b02a37",
  contrastText: "#ffffff",
};

const info = {
  lighter: "#e6f4f8",
  light: "#4fb3c8",
  main: "#0b7285",
  dark: "#095c6b",
  contrastText: "#ffffff",
};

const neutral = {
  50: "#f8fafc",
  100: "#f4f6f9",
  200: "#e5e9ef",
  300: "#cfd6df",
  500: "#8492a2",
  700: "#5b6672",
  900: "#1f2933",
};

const divider = "rgba(15, 23, 42, 0.12)";

// Colores para series de gráficos, en orden de uso.
const chartSeries = [
  primary.main,
  success.main,
  warning.main,
  error.main,
  "#6f42c1",
  info.main,
];

export default {
  primary,
  secondary: {
    main: neutral[700],
    contrastText: "#ffffff",
  },
  success,
  warning,
  error,
  info,
  neutral,
  background: {
    default: neutral[100],
    paper: "#ffffff",
    subtle: neutral[50],
  },
  text: {
    primary: neutral[900],
    secondary: neutral[700],
  },
  divider,
  charts: {
    series: chartSeries,
  },
};

import { icons } from "../../../utils/icons.jsx";

export const comprasMenuItems = [
  { text: "Inicio", icon: icons.home, path: "/home" },
  { text: "Dashboard", icon: icons.dashboard, path: "/compras" },
  {
    text: "Registrar Compra",
    icon: icons.addShoppingCart,
    path: "/compras/registrar",
  },
  {
    text: "Lista Compras",
    icon: icons.shoppingCart,
    path: "/compras/listaCompras",
  },
  { text: "Reportes", icon: icons.assessment, path: "/compras/reportes" },
];

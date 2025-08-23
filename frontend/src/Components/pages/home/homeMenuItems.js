import { icons } from "../../../utils/icons.jsx";

export const homeMenuItems = [
  { text: "Inicio", icon: icons.dashboard, path: "/home" },
  {
    text: "Compras",
    icon: icons.addShoppingCart,
    children: [
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
    ],
  },
  {
    text: "Categorias",
    icon: icons.dashboard,
    children: [
      { text: "Dashboard", icon: icons.dashboard, path: "/categorias" },
      {
        text: "Registrar Categoría",
        icon: icons.add,
        path: "/categorias/registrar",
      },
      {
        text: "Lista Categorías",
        icon: icons.list,
        path: "/categorias/consultar",
      },
    ],
  },
  {
    text: "Productos",
    icon: icons.productionQuantityLimits,
    children: [
      { text: "Dashboard", icon: icons.dashboard, path: "/productos" },
      {
        text: "Registrar Producto",
        icon: icons.add,
        path: "/productos/registrar",
      },
      { text: "Lista Productos", icon: icons.list, path: "/productos/lista" },
    ],
  },
  {
    text: "Proveedores",
    icon: icons.people,
    children: [
      { text: "Dashboard", icon: icons.dashboard, path: "/proveedores" },
      {
        text: "Registrar Proveedor",
        icon: icons.add,
        path: "/proveedores/registrar",
      },
      {
        text: "Lista Proveedores",
        icon: icons.list,
        path: "/proveedores/consultar",
      },
    ],
  },
];

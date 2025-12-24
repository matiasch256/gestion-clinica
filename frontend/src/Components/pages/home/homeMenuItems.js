import { icons } from "../../../utils/icons.jsx";
import { ROLES } from "../../../utils/roles";

export const homeMenuItems = [
  { text: "Inicio", icon: icons.dashboard, path: "/home" },
  {
    text: "Compras",
    icon: icons.addShoppingCart,
    roles: [ROLES.ADMIN],
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

    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
    children: [
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

    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
    children: [
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
    roles: [ROLES.ADMIN],
    children: [
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
  {
    text: "Turnos",
    icon: icons.event,
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
    children: [
      {
        text: "Registrar Turno",
        icon: icons.add,
        path: "/turnos/registrar",
      },
      {
        text: "Lista Turnos",
        icon: icons.list,
        path: "/turnos/ListaTurnos",
      },
      {
        text: "Historial por Paciente",
        icon: icons.history,
        path: "/turnos/historial",
      },
    ],
  },
  {
    text: "Pacientes",
    icon: icons.people,
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
    children: [
      {
        text: "Registrar Paciente",
        icon: icons.add,
        path: "/pacientes/registrar",
      },
      {
        text: "Lista de Pacientes",
        icon: icons.list,
        path: "/pacientes/consultar",
      },
    ],
  },
  {
    text: "Facturación",
    icon: icons.assessment,
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
    children: [
      {
        text: "Registrar Factura",
        icon: icons.add,
        path: "/facturacion/registrar",
      },
      {
        text: "Lista de Facturas",
        icon: icons.list,
        path: "/facturacion/consultar",
      },
    ],
  },
  {
    text: "Reportes",
    icon: icons.barChart,

    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
    children: [
      {
        text: "Reporte Stock",
        icon: icons.barChart,
        path: "/reportes/stock",

        roles: [ROLES.ADMIN, ROLES.DEPOSITO],
      },
      {
        text: "Stock por Categoría",
        icon: icons.pieChart,
        path: "/reportes/stock-categoria",

        roles: [ROLES.ADMIN, ROLES.DEPOSITO],
      },
      {
        text: "Tasa de Ausentismo",
        icon: icons.eventBusy,
        path: "/reportes/ausentismo",

        roles: [ROLES.ADMIN],
      },
      {
        text: "Rentabilidad",
        icon: icons.trendingUp,
        path: "/reportes/rentabilidad",

        roles: [ROLES.ADMIN],
      },
    ],
  },
];

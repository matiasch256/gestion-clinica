import { icons } from "../../../utils/icons.jsx";
import { ROLES } from "../../../utils/roles";

// Cada módulo pertenece a una sección: el menú lateral agrupa los módulos
// por sección y muestra un subtítulo por grupo.
export const MENU_SECTIONS = ["Clínica", "Depósito", "Análisis"];

export const homeMenuItems = [
  { text: "Inicio", icon: icons.home, path: "/home" },

  {
    text: "Turnos",
    section: "Clínica",
    icon: icons.event,
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
    children: [
      { text: "Registrar turno", path: "/turnos/registrar" },
      { text: "Lista de turnos", path: "/turnos/ListaTurnos" },
      { text: "Historial por paciente", path: "/turnos/historial" },
    ],
  },
  {
    text: "Pacientes",
    section: "Clínica",
    icon: icons.people,
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
    children: [
      { text: "Registrar paciente", path: "/pacientes/registrar" },
      { text: "Lista de pacientes", path: "/pacientes/consultar" },
    ],
  },
  {
    text: "Facturación",
    section: "Clínica",
    icon: icons.receipt,
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
    children: [
      { text: "Registrar factura", path: "/facturacion/registrar" },
      { text: "Lista de facturas", path: "/facturacion/consultar" },
    ],
  },

  {
    text: "Compras",
    section: "Depósito",
    icon: icons.shoppingCart,
    roles: [ROLES.ADMIN],
    children: [
      { text: "Resumen", path: "/compras" },
      { text: "Registrar compra", path: "/compras/registrar" },
      { text: "Lista de compras", path: "/compras/listaCompras" },
      { text: "Reportes", path: "/compras/reportes" },
    ],
  },
  {
    text: "Productos",
    section: "Depósito",
    icon: icons.inventory,
    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
    children: [
      { text: "Registrar producto", path: "/productos/registrar" },
      { text: "Lista de productos", path: "/productos/lista" },
    ],
  },
  {
    text: "Categorías",
    section: "Depósito",
    icon: icons.category,
    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
    children: [
      { text: "Registrar categoría", path: "/categorias/registrar" },
      { text: "Lista de categorías", path: "/categorias/consultar" },
    ],
  },
  {
    text: "Proveedores",
    section: "Depósito",
    icon: icons.localShipping,
    roles: [ROLES.ADMIN],
    children: [
      { text: "Registrar proveedor", path: "/proveedores/registrar" },
      { text: "Lista de proveedores", path: "/proveedores/consultar" },
    ],
  },

  {
    text: "Reportes",
    section: "Análisis",
    icon: icons.barChart,
    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
    children: [
      {
        text: "Stock crítico",
        path: "/reportes/stock",
        roles: [ROLES.ADMIN, ROLES.DEPOSITO],
      },
      {
        text: "Stock por categoría",
        path: "/reportes/stock-categoria",
        roles: [ROLES.ADMIN, ROLES.DEPOSITO],
      },
      {
        text: "Tasa de ausentismo",
        path: "/reportes/ausentismo",
        roles: [ROLES.ADMIN],
      },
      {
        text: "Rentabilidad",
        path: "/reportes/rentabilidad",
        roles: [ROLES.ADMIN],
      },
    ],
  },
];

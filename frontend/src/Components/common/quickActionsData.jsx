import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { ROLES } from "../../utils/roles";

// Cada acción lleva a una pantalla real. "roles" limita quién la ve.
export const quickActionsHome = [
  {
    title: "Nuevo turno",
    description: "Agendar un turno médico",
    icon: EventIcon,
    path: "/turnos/registrar",
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
  },
  {
    title: "Nuevo paciente",
    description: "Registrar un paciente",
    icon: PersonAddIcon,
    path: "/pacientes/registrar",
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
  },
  {
    title: "Nueva factura",
    description: "Facturar servicios a un paciente",
    icon: ReceiptLongIcon,
    path: "/facturacion/registrar",
    roles: [ROLES.ADMIN, ROLES.RECEPCION],
  },
  {
    title: "Nueva compra",
    description: "Registrar una orden de compra",
    icon: ShoppingCartIcon,
    path: "/compras/registrar",
    roles: [ROLES.ADMIN],
  },
  {
    title: "Agregar producto",
    description: "Nuevo producto al inventario",
    icon: InventoryIcon,
    path: "/productos/registrar",
    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
  },
  {
    title: "Nueva categoría",
    description: "Crear una categoría de productos",
    icon: CategoryIcon,
    path: "/categorias/registrar",
    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
  },
  {
    title: "Nuevo proveedor",
    description: "Registrar un proveedor",
    icon: LocalShippingIcon,
    path: "/proveedores/registrar",
    roles: [ROLES.ADMIN],
  },
];

export const quickActionsCompras = [
  {
    title: "Registrar compra",
    description: "Crear una nueva orden de compra",
    icon: AddShoppingCartOutlinedIcon,
    path: "/compras/registrar",
  },
  {
    title: "Ver compras",
    description: "Consultar y gestionar las órdenes",
    icon: ListAltIcon,
    path: "/compras/listaCompras",
  },
  {
    title: "Consultar stock",
    description: "Revisar el inventario actual",
    icon: Inventory2OutlinedIcon,
    path: "/productos/lista",
  },
  {
    title: "Reportes de compras",
    description: "Gastos y productos más comprados",
    icon: AssessmentOutlinedIcon,
    path: "/compras/reportes",
  },
];

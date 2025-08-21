import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";

const quickActions = [
  {
    title: "Nueva Compra",
    description: "Registrar una nueva orden",
    color: "#3B83F6", // Azul
    colorHover: "#2564EB",
    icon: ShoppingCartIcon,
    action: () => alert("Registrando nueva compra..."),
  },
  {
    title: "Agregar Producto",
    description: "Nuevo producto al inventario",
    color: "#4caf50", // Verde
    colorHover: "#43a047",
    icon: InventoryIcon,
    action: () => alert("Agregando producto..."),
  },
  {
    title: "Nuevo Proveedor",
    description: "Registrar proveedor",
    color: "#ab47bc", // Púrpura
    colorHover: "#9c27b0",
    icon: PeopleIcon,
    action: () => alert("Registrando proveedor..."),
  },
  {
    title: "Nueva Categoría",
    description: "Crear categoría",
    color: "#ff9800", // Naranja
    colorHover: "#fb8c00",
    icon: FolderIcon,
    action: () => alert("Creando categoría..."),
  },
];

export default quickActions;

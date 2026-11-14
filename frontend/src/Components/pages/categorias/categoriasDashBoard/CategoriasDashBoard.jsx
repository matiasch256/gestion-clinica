import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import PageHeader from "../../../common/PageHeader";
import SystemMetricsGrid from "../../../common/SystemMetricsGrid";
import QuickActionsCard from "../../../common/QuickActionsCard";

const METRICS = [
  {
    title: "Categorías activas",
    value: "12",
    caption: "En uso",
    icon: CategoryIcon,
  },
  {
    title: "Sin productos",
    value: "3",
    caption: "Categorías vacías",
    icon: Inventory2OutlinedIcon,
    tone: "warning",
  },
  {
    title: "Más populares",
    value: "2",
    caption: "Electrónica, Herramientas",
    icon: StarBorderIcon,
  },
  {
    title: "Categorías nuevas",
    value: "2",
    caption: "Creadas esta semana",
    icon: FiberNewOutlinedIcon,
  },
];

const ACTIONS = [
  {
    title: "Agregar categoría",
    description: "Crear una categoría nueva",
    icon: AddIcon,
    path: "/categorias/registrar",
  },
  {
    title: "Ver todas",
    description: "Consultar, editar o eliminar categorías",
    icon: ListIcon,
    path: "/categorias/consultar",
  },
];

export const CategoriasDashboard = () => (
  <>
    <PageHeader
      title="Categorías"
      subtitle="Resumen de las categorías de productos"
    />
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <SystemMetricsGrid systemMetrics={METRICS} />
      <QuickActionsCard quickActions={ACTIONS} />
    </Box>
  </>
);

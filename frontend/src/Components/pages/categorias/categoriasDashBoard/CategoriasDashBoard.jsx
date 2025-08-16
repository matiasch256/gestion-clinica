import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListIcon from "@mui/icons-material/List";
import InfoCard from "../../../common/InfoCard";
import QuickActionButton from "../../../common/QuickActionButton";
import DashboardContent from "../../../common/DashboardContent";

export const CategoriasDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    <InfoCard title="Categorías Activas" content="12 categorías en uso" />,
    <InfoCard title="Sin Productos" content="3 categorías vacías" />,
    <InfoCard title="Más Populares" content="Electrónica, Herramientas" />,
    <InfoCard title="Categorías Nuevas" content="2 creadas esta semana" />,
  ];

  const actions = [
    <QuickActionButton
      icon={<AddIcon />}
      label="Agregar Categoría"
      onClick={() => navigate("/categorias/registrar")}
    />,
    <QuickActionButton
      icon={<EditIcon />}
      label="Editar Categoría"
      onClick={() => navigate("/categorias/consultar")}
    />,
    <QuickActionButton
      icon={<DeleteIcon />}
      label="Eliminar Categoría"
      onClick={() => navigate("/categorias/consultar")}
    />,
    <QuickActionButton
      icon={<ListIcon />}
      label="Ver Todas"
      onClick={() => navigate("/categorias/consultar")}
    />,
  ];

  return (
    <DashboardContent
      title="Dashboard de Categorías"
      cards={cards}
      actions={actions}
    />
  );
};

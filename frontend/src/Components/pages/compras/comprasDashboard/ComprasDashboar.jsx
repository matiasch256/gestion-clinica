import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InfoCard from "../../../common/InfoCard";
import QuickActionButton from "../../../common/QuickActionButton";
import DashboardContent from "../../../common/DashboardContent";

export const ComprasDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    <InfoCard title="Órdenes Pendientes" content="5 órdenes sin aprobar" />,
    <InfoCard title="Facturas Recientes" content="3 nuevas esta semana" />,
    <InfoCard title="Stock Crítico" content="2 productos debajo del mínimo" />,
    <InfoCard title="Total Comprado (Mes)" content="$248.000" />,
  ];

  const actions = [
    <QuickActionButton
      icon={<AddIcon />}
      label="Registrar Compra"
      onClick={() => navigate("/compras/registrar")}
    />,
    <QuickActionButton
      icon={<ReceiptIcon />}
      label="Ver Facturas"
      onClick={() => navigate("/compras/lista")}
    />,
    <QuickActionButton
      icon={<InventoryIcon />}
      label="Consultar Stock"
      onClick={() => navigate("/stock")}
    />,
    <QuickActionButton
      icon={<VisibilityIcon />}
      label="Ver Órdenes"
      onClick={() => navigate("/ordenes")}
    />,
  ];

  return (
    <DashboardContent
      title="Dashboard de Compras"
      cards={cards}
      actions={actions}
    />
  );
};

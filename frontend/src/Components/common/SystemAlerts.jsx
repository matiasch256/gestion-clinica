import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import SectionCard from "./SectionCard";
import { useAuth } from "../../context/authContext";
import { ROLES } from "../../utils/roles";

const ALERTS = [
  {
    severity: "warning",
    title: "Stock bajo en 3 productos",
    detail: "Requiere atención inmediata",
    action: "Ver detalles",
    path: "/reportes/stock",
    roles: [ROLES.ADMIN, ROLES.DEPOSITO],
  },
  {
    severity: "info",
    title: "5 órdenes pendientes de aprobación",
    detail: "Esperando revisión",
    action: "Revisar",
    path: "/compras/listaCompras",
    roles: [ROLES.ADMIN],
  },
];

// Alertas con los colores de estado del tema: ámbar = atención, celeste = aviso.
const SystemAlerts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const visible = ALERTS.filter((alert) => alert.roles.includes(user?.Rol));
  if (visible.length === 0) return null;

  return (
    <SectionCard title="Alertas del sistema">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {visible.map((alert) => (
          <Alert
            key={alert.path}
            severity={alert.severity}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate(alert.path)}
              >
                {alert.action}
              </Button>
            }
            sx={{ alignItems: "center" }}
          >
            <AlertTitle sx={{ mb: 0 }}>{alert.title}</AlertTitle>
            {alert.detail}
          </Alert>
        ))}
      </Box>
    </SectionCard>
  );
};

export default SystemAlerts;

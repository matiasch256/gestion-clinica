import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SectionCard from "./SectionCard";

const ACTIVITY = [
  {
    icon: CheckCircleOutlineIcon,
    tone: "success",
    text: "Orden de compra aprobada",
    detail: "ORD-001 - Proveedor ABC",
    time: "Hace 2 horas",
  },
  {
    icon: AddCircleOutlineIcon,
    tone: "primary",
    text: "Nuevo producto agregado",
    detail: "Cuadernos Universitarios - 100 unidades",
    time: "Hace 4 horas",
  },
  {
    icon: WarningAmberIcon,
    tone: "warning",
    text: "Stock bajo detectado",
    detail: "Papel A4 - Solo quedan 15 paquetes",
    time: "Hace 6 horas",
  },
  {
    icon: CheckCircleOutlineIcon,
    tone: "success",
    text: "Factura procesada",
    detail: "FAC-458 - $32,100",
    time: "Ayer",
  },
];

const RecentActivity = () => (
  <SectionCard title="Actividad reciente" disablePadding>
    {ACTIVITY.map((activity, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 3,
          py: 1.5,
          borderTop: index === 0 ? 0 : 1,
          borderColor: "divider",
        }}
      >
        <activity.icon
          fontSize="small"
          sx={{ color: `${activity.tone}.main` }}
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2">{activity.text}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {activity.detail}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" noWrap>
          {activity.time}
        </Typography>
      </Box>
    ))}
  </SectionCard>
);

export default RecentActivity;

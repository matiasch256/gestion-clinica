import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">Actividad Reciente</Typography>}
      />
      <CardContent>
        <List sx={{ padding: 0 }}>
          {[
            {
              icon: CheckCircleIcon,
              text: "Orden de compra aprobada",
              detail: "ORD-001 - Proveedor ABC",
              time: "Hace 2 horas",
            },
            {
              icon: AddCircleOutlineIcon,
              text: "Nuevo producto agregado",
              detail: "Cuadernos Universitarios - 100 unidades",
              time: "Hace 4 horas",
            },
            {
              icon: WarningAmberIcon,
              text: "Stock bajo detectado",
              detail: "Papel A4 - Solo quedan 15 paquetes",
              time: "Hace 6 horas",
            },
            {
              icon: CheckCircleIcon,
              text: "Factura procesada",
              detail: "FAC-458 - $32,100",
              time: "Ayer",
            },
          ].map((activity, index) => (
            <ListItem
              key={index}
              sx={{
                paddingY: 1,
                borderBottom: index < 3 ? "1px solid #e0e0e0" : "none",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <ListItemIcon>
                <activity.icon
                  sx={{
                    color:
                      activity.icon === WarningAmberIcon
                        ? "#f59e0b"
                        : "#4caf50",
                    fontSize: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="medium">
                    {activity.text}
                  </Typography>
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row", // texto + icono en la misma fila
                      alignItems: "center", // centra verticalmente
                      gap: 0.5,
                      color: "#6b7280",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ flex: 1 }} // ocupa el espacio a la izquierda
                    >
                      {activity.detail}
                    </Typography>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

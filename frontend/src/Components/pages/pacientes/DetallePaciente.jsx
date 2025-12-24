import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";

const InfoItem = ({ icon, primary, secondary }) => (
  <ListItem>
    <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

export const DetallePaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/pacientes/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setPaciente(data);
      })
      .catch((error) => {
        console.error("Error al cargar el detalle del paciente:", error);
        setPaciente(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (!paciente) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Paciente no encontrado
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: "primary.main" }}>
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1">
            {paciente.Nombre} {paciente.Apellido}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Paciente ID: {paciente.ID_Paciente}
          </Typography>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <List>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<BadgeIcon />}
                primary="DNI"
                secondary={paciente.DNI}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<CakeIcon />}
                primary="Fecha de Nacimiento"
                secondary={
                  paciente.FechaNacimiento
                    ? new Date(paciente.FechaNacimiento).toLocaleDateString(
                        "es-AR"
                      )
                    : "No especificada"
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<WcIcon />}
                primary="Género"
                secondary={paciente.Genero || "No especificado"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<EmailIcon />}
                primary="Email"
                secondary={paciente.Email || "No registrado"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<PhoneIcon />}
                primary="Teléfono"
                secondary={paciente.Telefono || "No registrado"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem
                icon={<PhoneIcon />}
                primary="Celular"
                secondary={paciente.Celular || "No registrado"}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <InfoItem
                icon={<HomeIcon />}
                primary="Dirección"
                secondary={
                  [paciente.Direccion, paciente.Ciudad, paciente.Provincia]
                    .filter(Boolean)
                    .join(", ") +
                    (paciente.CodigoPostal
                      ? ` (${paciente.CodigoPostal})`
                      : "") || "No especificada"
                }
              />
            </Grid>
          </Grid>
        </List>
      </Paper>

      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mt: 3 }}
      >
        Volver a la Lista
      </Button>
    </Box>
  );
};

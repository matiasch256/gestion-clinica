import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Skeleton,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomIcon from "@mui/icons-material/Room";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function DetalleTurno() {
  const theme = useTheme();
  const { turnoId } = useParams();
  const navigate = useNavigate();
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/turnos/${turnoId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setTurno(data);
      })
      .catch((error) => {
        console.error("Error al cargar el detalle del turno:", error);
        setTurno(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [turnoId]);

  const getStatusChip = (estado) => {
    let color = "default";
    let textColor = theme.palette.text.primary;
    let borderColor = theme.palette.divider;

    switch (estado) {
      case "Programado":
        color = "primary";
        break;
      case "Confirmado":
        color = "info";
        break;
      case "En Sala de Espera":
        color = "warning";
        textColor = theme.palette.warning.main;
        borderColor = theme.palette.warning.main;
        break;
      case "Atendido":
        color = "success";
        textColor = theme.palette.success.main;
        borderColor = theme.palette.success.main;
        break;
      case "Cancelado":
        color = "error";
        textColor = theme.palette.error.main;
        borderColor = theme.palette.error.main;
        break;
      default:
        break;
    }

    return (
      <Chip
        label={estado}
        color={color}
        variant="outlined"
        sx={{
          fontWeight: "bold",
          borderColor: borderColor,
          color: textColor,
          bgcolor: theme.palette.background.trasparent,
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  if (!turno) {
    return (
      <Box sx={{ p: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper
          elevation={0}
          sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Turno no encontrado
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            VOLVER
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "700",
              color: theme.palette.text.primary,
              borderLeft: `5px solid ${theme.palette.primary.main}`,
              paddingLeft: 2,
            }}
          >
            Detalle del Turno N° {turno.ID_TurnoMedico}
          </Typography>

          <Box>{getStatusChip(turno.Estado)}</Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                <EventIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Agenda
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
              >
                <AccessTimeIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    FECHA Y HORA
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {new Date(turno.FechaHora).toLocaleString("es-AR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <RoomIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    CONSULTORIO
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {turno.Consultorio || "No asignado"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color:
                    theme.palette.secondary?.main || theme.palette.text.primary,
                }}
              >
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Paciente
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="h6" gutterBottom color="primary.main">
                {turno.NombrePaciente} {turno.ApellidoPaciente}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}
              >
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {turno.EmailPaciente || "Sin email"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {turno.TelefonoPaciente || "Sin teléfono"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color:
                    theme.palette.accent?.green || theme.palette.success.main,
                }}
              >
                <MedicalServicesIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Médico
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="h6" gutterBottom>
                Dr/a. {turno.NombreMedico} {turno.ApellidoMedico}
              </Typography>

              <Chip
                label={turno.Especialidad || "Medicina General"}
                size="small"
                sx={{
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.background.trasparent,
              fontWeight: "bold",
              px: 4,
              py: 1,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}10`,
              },
            }}
          >
            VOLVER
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

import EmptyState from "../../common/EmptyState";
import SectionCard from "../../common/SectionCard";
import DetailItem from "../../common/DetailItem";
import StatusChip from "../../common/StatusChip";
import PageHeader from "../../common/PageHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  if (loading) {
    return <Skeleton variant="rounded" height={240} />;
  }

  if (!turno) {
    return (
      <EmptyState
        title="Turno no encontrado"
        action={
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Volver
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={`Turno #${turno.ID_TurnoMedico}`}
        subtitle="Detalle del turno médico"
        onBack={() => navigate(-1)}
        actions={<StatusChip status={turno.Estado} />}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="Agenda"
            icon={<EventIcon />}
            sx={{ height: "100%" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DetailItem
                label="Fecha y hora"
                value={new Date(turno.FechaHora).toLocaleString("es-AR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              />
              <DetailItem
                label="Consultorio"
                value={turno.Consultorio || "No asignado"}
              />
            </Box>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="Paciente"
            icon={<PersonIcon />}
            sx={{ height: "100%" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DetailItem
                label="Nombre"
                value={`${turno.NombrePaciente} ${turno.ApellidoPaciente}`}
              />
              <DetailItem
                label="Email"
                value={turno.EmailPaciente || "Sin email"}
              />
              <DetailItem
                label="Teléfono"
                value={turno.TelefonoPaciente || "Sin teléfono"}
              />
            </Box>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="Médico"
            icon={<MedicalServicesIcon />}
            sx={{ height: "100%" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DetailItem
                label="Profesional"
                value={`Dr/a. ${turno.NombreMedico} ${turno.ApellidoMedico}`}
              />
              <DetailItem
                label="Especialidad"
                value={turno.Especialidad || "Medicina General"}
              />
            </Box>
          </SectionCard>
        </Grid>
      </Grid>
    </>
  );
}

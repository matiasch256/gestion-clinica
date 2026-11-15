import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import DetailItem from "../../common/DetailItem";
import EmptyState from "../../common/EmptyState";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
    return <Skeleton variant="rounded" height={320} />;
  }

  if (!paciente) {
    return (
      <EmptyState
        title="Paciente no encontrado"
        action={
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Volver
          </Button>
        }
      />
    );
  }

  const direccion =
    [paciente.Direccion, paciente.Ciudad, paciente.Provincia]
      .filter(Boolean)
      .join(", ") +
      (paciente.CodigoPostal ? ` (${paciente.CodigoPostal})` : "") ||
    "No especificada";

  return (
    <>
      <PageHeader
        title={`${paciente.Nombre} ${paciente.Apellido}`}
        subtitle={`Paciente #${paciente.ID_Paciente}`}
        onBack={() => navigate(-1)}
        actions={
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() =>
              navigate(`/pacientes/modificar/${paciente.ID_Paciente}`)
            }
          >
            Editar
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Datos personales"
            icon={<BadgeIcon />}
            sx={{ height: "100%" }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <DetailItem label="DNI" value={paciente.DNI} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem
                  label="Fecha de nacimiento"
                  value={
                    paciente.FechaNacimiento
                      ? new Date(paciente.FechaNacimiento).toLocaleDateString(
                          "es-AR"
                        )
                      : "No especificada"
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem
                  label="Género"
                  value={paciente.Genero || "No especificado"}
                />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Contacto"
            icon={<PhoneIcon />}
            sx={{ height: "100%" }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <DetailItem
                  label="Email"
                  value={paciente.Email || "No registrado"}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem
                  label="Teléfono"
                  value={paciente.Telefono || "No registrado"}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem
                  label="Celular"
                  value={paciente.Celular || "No registrado"}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DetailItem label="Dirección" value={direccion} />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>
      </Grid>
    </>
  );
};

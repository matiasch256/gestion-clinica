import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import FormContainer from "../../common/FormContainer";
import FormActions from "../../common/FormActions";
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const RegistrarTurno = () => {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [consultorio, setConsultorio] = useState("");
  const [estadoTurnoId, setEstadoTurnoId] = useState(1);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    isError: false,
  });

  const navigate = useNavigate();
  const { turnoId } = useParams();
  const isEditMode = Boolean(turnoId);

  useEffect(() => {
    fetch("http://localhost:3000/api/pacientes")
      .then((res) => res.json())
      .then(setPacientes);
    fetch("http://localhost:3000/api/profesionales")
      .then((res) => res.json())
      .then(setMedicos);

    if (isEditMode) {
      fetch(`http://localhost:3000/api/turnos/${turnoId}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          setPacienteId(data.ID_Paciente);
          setMedicoId(data.ID_Medico);
          setEstadoTurnoId(data.ID_EstadoTurno);
          setConsultorio(data.Consultorio || "");

          const fechaHora = new Date(data.FechaHora);
          const yyyy = fechaHora.getFullYear();
          const mm = String(fechaHora.getMonth() + 1).padStart(2, "0");
          const dd = String(fechaHora.getDate()).padStart(2, "0");
          setFecha(`${yyyy}-${mm}-${dd}`);
          const hh = String(fechaHora.getHours()).padStart(2, "0");
          const min = String(fechaHora.getMinutes()).padStart(2, "0");
          setHora(`${hh}:${min}`);
        })
        .catch((err) => {
          console.error("Error al cargar datos del turno para editar:", err);
          setDialog({
            open: true,
            title: "Error",
            message: "No se pudieron cargar los datos del turno para editar.",
            isError: true,
          });
        });
    }
  }, [turnoId]);

  const handleCloseDialog = () => {
    if (!dialog.isError) {
      navigate("/turnos/ListaTurnos");
    }
    setDialog({ ...dialog, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicoId || !fecha || !hora || !pacienteId) {
      setDialog({
        open: true,
        title: "Campos Incompletos",
        message: "Todos los campos son obligatorios.",
        isError: true,
      });
      return;
    }

    const turnoData = {
      pacienteId,
      medicoId,
      fecha,
      hora,
      estadoTurnoId,
      consultorio,
    };

    const url = isEditMode
      ? `http://localhost:3000/api/turnos/${turnoId}`
      : "http://localhost:3000/api/turnos";
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turnoData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.details || "Error al guardar el turno.");
        }
        return res.json();
      })
      .then(() => {
        const message = isEditMode
          ? "Turno actualizado correctamente."
          : "Turno registrado correctamente.";
        setDialog({ open: true, title: "¡Éxito!", message, isError: false });
      })
      .catch((err) => {
        setDialog({
          open: true,
          title: "Error",
          message: err.message,
          isError: true,
        });
      });
  };

  return (
    <>
      <PageHeader
        title={isEditMode ? "Editar turno" : "Registrar turno"}
        subtitle="Asigná un paciente, un médico y un horario"
        onBack={() => navigate(-1)}
      />

      <FormContainer onSubmit={handleSubmit}>
        <SectionCard title="Datos del turno">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                required
                fullWidth
                label="Paciente"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {pacientes.map((p) => (
                  <MenuItem key={p.ID_Paciente} value={p.ID_Paciente}>
                    {p.Nombre} {p.Apellido}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                required
                fullWidth
                label="Médico"
                value={medicoId}
                onChange={(e) => setMedicoId(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {medicos.map((m) => (
                  <MenuItem key={m.ID_Medico} value={m.ID_Medico}>
                    {m.Nombre} {m.Apellido} ({m.Especialidad})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                required
                fullWidth
                label="Fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                required
                fullWidth
                label="Hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Consultorio (opcional)"
                value={consultorio}
                onChange={(e) => setConsultorio(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>
          <FormActions
            onCancel={() => navigate(-1)}
            submitLabel={isEditMode ? "Actualizar turno" : "Registrar turno"}
          />
        </SectionCard>
      </FormContainer>

      <Dialog open={dialog.open} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          {dialog.isError ? (
            <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
          ) : (
            <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
          )}
          {dialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegistrarTurno;

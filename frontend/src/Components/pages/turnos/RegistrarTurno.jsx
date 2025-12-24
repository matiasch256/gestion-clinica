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
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {isEditMode ? "Editar Turno" : "Registrar Turno"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: "100%", mt: 1 }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel>Paciente</InputLabel>
            <Select
              value={pacienteId}
              label="Paciente"
              onChange={(e) => setPacienteId(e.target.value)}
            >
              <MenuItem value="">
                <em>Seleccione un paciente</em>
              </MenuItem>
              {pacientes.map((p) => (
                <MenuItem key={p.ID_Paciente} value={p.ID_Paciente}>
                  {p.Nombre} {p.Apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Médico</InputLabel>
            <Select
              value={medicoId}
              label="Médico"
              onChange={(e) => setMedicoId(e.target.value)}
            >
              <MenuItem value="">
                <em>Seleccione un médico</em>
              </MenuItem>
              {medicos.map((m) => (
                <MenuItem key={m.ID_Medico} value={m.ID_Medico}>
                  {m.Nombre} {m.Apellido} ({m.Especialidad})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            label="Fecha del Turno"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Hora del Turno"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Consultorio (Opcional)"
            type="text"
            value={consultorio}
            onChange={(e) => setConsultorio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 200,
              "& .MuiInputBase-input": { minHeight: 56 },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              {isEditMode ? "Volver" : "Cancelar"}
            </Button>
            <Button type="submit" fullWidth variant="contained">
              {isEditMode ? "Actualizar" : "Registrar"}
            </Button>
          </Box>
        </Box>
      </Paper>

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
    </Container>
  );
};

export default RegistrarTurno;

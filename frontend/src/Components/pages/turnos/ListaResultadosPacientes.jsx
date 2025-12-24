import { Box, Typography, Paper, Button, Chip } from "@mui/material";

export const ListaResultadosPacientes = ({ pacientes, onSelectPaciente }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" gutterBottom>
      {pacientes.length} paciente(s) encontrado(s)
    </Typography>
    {pacientes.map((paciente) => (
      <Paper
        key={paciente.ID_Paciente}
        elevation={2}
        sx={{
          mb: 2,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">
            {paciente.Apellido}, {paciente.Nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            DNI: {paciente.DNI || "No cargado"} | Tel:{" "}
            {paciente.Telefono || "No cargado"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={paciente.ObraSocial || "Privado"}
            color="primary"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={() => onSelectPaciente(paciente)}
          >
            Ver Historial
          </Button>
        </Box>
      </Paper>
    ))}
  </Box>
);

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";

export const DetalleHistorialPaciente = ({ paciente }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paciente) {
      setLoading(true);
      fetch(`http://localhost:3000/api/turnos/paciente/${paciente.ID_Paciente}`)
        .then((res) => res.json())
        .then((data) => {
          setTurnos(data);
          setLoading(false);
        });
    }
  }, [paciente]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Historial de: {paciente.Nombre} {paciente.Apellido}
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Costo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ) : turnos.length > 0 ? (
              turnos.map((turno) => (
                <TableRow key={turno.ID_TurnoMedico}>
                  <TableCell>
                    {new Date(turno.FechaHora).toLocaleString("es-AR")}
                  </TableCell>
                  <TableCell>{turno.Medico}</TableCell>
                  <TableCell>{turno.Especialidad || "N/A"}</TableCell>
                  <TableCell>{turno.Servicio || "No especificado"}</TableCell>
                  <TableCell>{turno.Estado}</TableCell>
                  <TableCell>
                    ${turno.Costo ? turno.Costo.toFixed(2) : "0.00"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Este paciente no tiene turnos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

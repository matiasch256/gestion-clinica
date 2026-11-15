import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import SectionCard from "../../common/SectionCard";
import StatusChip from "../../common/StatusChip";
import SkeletonRows from "../../common/SkeletonRows";
import EmptyState from "../../common/EmptyState";

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
    <SectionCard
      title={`Historial de ${paciente.Nombre} ${paciente.Apellido}`}
      description={`DNI: ${paciente.DNI || "No cargado"}`}
      disablePadding
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha y hora</TableCell>
            <TableCell>Médico</TableCell>
            <TableCell>Especialidad</TableCell>
            <TableCell>Servicio</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="right">Costo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <SkeletonRows rows={3} columns={6} />
          ) : turnos.length > 0 ? (
            turnos.map((turno) => (
              <TableRow key={turno.ID_TurnoMedico} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  {new Date(turno.FechaHora).toLocaleString("es-AR")}
                </TableCell>
                <TableCell>{turno.Medico}</TableCell>
                <TableCell>{turno.Especialidad || "N/A"}</TableCell>
                <TableCell>{turno.Servicio || "No especificado"}</TableCell>
                <TableCell align="center">
                  <StatusChip status={turno.Estado} />
                </TableCell>
                <TableCell align="right">
                  ${turno.Costo ? turno.Costo.toFixed(2) : "0.00"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState title="Este paciente no tiene turnos registrados" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
};

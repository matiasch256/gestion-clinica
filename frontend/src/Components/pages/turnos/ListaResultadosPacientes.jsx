import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCard from "../../common/TableCard";
import { countLabel } from "../../../utils/tableLabels";

export const ListaResultadosPacientes = ({ pacientes, onSelectPaciente }) => (
  <TableCard
    summary={countLabel(
      pacientes.length,
      "paciente encontrado",
      "pacientes encontrados"
    )}
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Apellido y nombre</TableCell>
          <TableCell>DNI</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Obra social</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {pacientes.map((paciente) => (
          <TableRow key={paciente.ID_Paciente} hover>
            <TableCell sx={{ fontWeight: 600 }}>
              {paciente.Apellido}, {paciente.Nombre}
            </TableCell>
            <TableCell>{paciente.DNI || "No cargado"}</TableCell>
            <TableCell>{paciente.Telefono || "No cargado"}</TableCell>
            <TableCell>{paciente.ObraSocial || "Particular"}</TableCell>
            <TableCell align="right">
              <Button size="small" onClick={() => onSelectPaciente(paciente)}>
                Ver historial
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableCard>
);

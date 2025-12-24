import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { BuscadorPacientes } from "./BuscadorPacientes";
import { ListaResultadosPacientes } from "./ListaResultadosPacientes";
import { DetalleHistorialPaciente } from "./DetalleHistorialPaciente";

export const HistorialTurnosPaciente = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSearch = (term) => {
    if (term.length > 2) {
      fetch(`http://localhost:3000/api/pacientes/search?term=${term}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data));
    } else {
      setSearchResults([]);
    }
    setSelectedPatient(null);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Historial de Turnos
        </Typography>
        <Button variant="contained">Ir a Agenda</Button>
      </Box>

      <BuscadorPacientes onSearch={handleSearch} />

      {searchResults.length > 0 && (
        <ListaResultadosPacientes
          pacientes={searchResults}
          onSelectPaciente={setSelectedPatient}
        />
      )}

      {selectedPatient && (
        <DetalleHistorialPaciente paciente={selectedPatient} />
      )}
    </Box>
  );
};

export default HistorialTurnosPaciente;

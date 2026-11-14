import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import PageHeader from "../../common/PageHeader";
import { BuscadorPacientes } from "./BuscadorPacientes";
import { ListaResultadosPacientes } from "./ListaResultadosPacientes";
import { DetalleHistorialPaciente } from "./DetalleHistorialPaciente";

export const HistorialTurnosPaciente = () => {
  const navigate = useNavigate();
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
    <>
      <PageHeader
        title="Historial de turnos"
        subtitle="Buscá un paciente para ver todos sus turnos"
        actions={
          <Button
            variant="outlined"
            onClick={() => navigate("/turnos/ListaTurnos")}
          >
            Ir a la agenda
          </Button>
        }
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <BuscadorPacientes onSearch={handleSearch} />

        {searchResults.length > 0 && !selectedPatient && (
          <ListaResultadosPacientes
            pacientes={searchResults}
            onSelectPaciente={setSelectedPatient}
          />
        )}

        {selectedPatient && (
          <DetalleHistorialPaciente paciente={selectedPatient} />
        )}
      </Box>
    </>
  );
};

export default HistorialTurnosPaciente;

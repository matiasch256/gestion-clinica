import { Paper, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const BuscadorPacientes = ({ onSearch }) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
    <TextField
      fullWidth
      size="medium"
      label="Paciente"
      placeholder="Nombre, documento o teléfono (mínimo 3 caracteres)"
      onChange={(e) => onSearch(e.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
    />
  </Paper>
);

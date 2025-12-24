import { Paper, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const BuscadorPacientes = ({ onSearch }) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Escriba el nombre, documento o teléfono del paciente..."
      onChange={(e) => onSearch(e.target.value)}
      sx={{ "& .MuiInputBase-input": { minHeight: 50, border: "transparent" } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  </Paper>
);

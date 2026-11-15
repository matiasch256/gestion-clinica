import { Box, Button, Grid, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

// Bloque de filtros de los listados. Los hijos son <Grid size={...}> con
// los campos; los botones Buscar / Limpiar quedan siempre a la derecha.
const FilterBar = ({ children, onSearch, onClear }) => (
  <Paper
    variant="outlined"
    component="form"
    onSubmit={(event) => {
      event.preventDefault();
      onSearch?.();
    }}
    sx={{ p: 2, mb: 2, borderRadius: 3 }}
  >
    <Grid container spacing={2} alignItems="center">
      {children}
      <Grid size={{ xs: 12, md: "grow" }}>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {onClear && (
            <Button
              color="inherit"
              startIcon={<FilterAltOffIcon />}
              onClick={onClear}
              sx={{ color: "text.secondary" }}
            >
              Limpiar
            </Button>
          )}
          {onSearch && (
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

export default FilterBar;

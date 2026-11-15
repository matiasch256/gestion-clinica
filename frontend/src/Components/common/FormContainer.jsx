import { Box } from "@mui/material";
import { FORM_MAX_WIDTH } from "../../theme/theme";

// Contenedor de todos los formularios: mismo ancho máximo, alineado a la
// izquierda y con la misma separación entre secciones.
const FormContainer = ({ onSubmit, maxWidth = FORM_MAX_WIDTH, children }) => (
  <Box
    component="form"
    onSubmit={onSubmit}
    noValidate
    sx={{ maxWidth, display: "flex", flexDirection: "column", gap: 3 }}
  >
    {children}
  </Box>
);

export default FormContainer;

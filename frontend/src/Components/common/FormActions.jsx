import { Box, Button } from "@mui/material";

// Botonera de formularios: siempre abajo a la derecha, con una sola
// acción principal (contraste) y Cancelar como secundaria.
const FormActions = ({
  onCancel,
  cancelLabel = "Cancelar",
  submitLabel = "Guardar",
  onSubmit,
  disabled = false,
  startIcon,
  children,
}) => (
  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
    {children}
    {onCancel && (
      <Button
        color="inherit"
        onClick={onCancel}
        sx={{ color: "text.secondary" }}
      >
        {cancelLabel}
      </Button>
    )}
    <Button
      type={onSubmit ? "button" : "submit"}
      variant="contained"
      onClick={onSubmit}
      disabled={disabled}
      startIcon={startIcon}
    >
      {submitLabel}
    </Button>
  </Box>
);

export default FormActions;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Diálogo de resultado de un formulario (éxito o error).
// dialog = { open, title, message, isError }
const ResultDialog = ({ dialog, onClose }) => (
  <Dialog open={dialog.open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {dialog.isError ? (
        <ErrorOutlineIcon color="error" />
      ) : (
        <CheckCircleOutlineIcon color="success" />
      )}
      {dialog.title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{dialog.message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button variant="contained" onClick={onClose} autoFocus>
        Aceptar
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResultDialog;

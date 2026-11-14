import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";

const FeedbackContext = createContext(null);

// Avisos y confirmaciones iguales en toda la app. Reemplaza a
// alert() y window.confirm().
//   const { notify, confirm } = useFeedback();
//   notify("Guardado", "success");
//   if (await confirm({ title, message, destructive: true })) { ... }
export const FeedbackProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialog, setDialog] = useState({ open: false });
  const resolver = useRef(null);

  const notify = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setDialog({ open: true, ...options });
      }),
    []
  );

  const closeDialog = (result) => {
    setDialog((prev) => ({ ...prev, open: false }));
    resolver.current?.(result);
    resolver.current = null;
  };

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <FeedbackContext.Provider value={{ notify, confirm }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") closeSnackbar();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialog.open}
        onClose={() => closeDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{dialog.title || "Confirmar"}</DialogTitle>
        {dialog.message && (
          <DialogContent>
            <DialogContentText>{dialog.message}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            color="inherit"
            onClick={() => closeDialog(false)}
            sx={{ color: "text.secondary" }}
          >
            {dialog.cancelLabel || "Cancelar"}
          </Button>
          <Button
            variant="contained"
            color={dialog.destructive ? "error" : "primary"}
            onClick={() => closeDialog(true)}
            autoFocus
          >
            {dialog.confirmLabel || "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </FeedbackContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedback = () => useContext(FeedbackContext);

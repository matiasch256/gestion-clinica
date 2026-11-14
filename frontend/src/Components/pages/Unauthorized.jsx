import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          p: 2,
          borderRadius: "50%",
          bgcolor: "error.lighter",
          color: "error.main",
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 40 }} />
      </Box>
      <Typography variant="h5" component="h1">
        Acceso denegado
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
        No tenés los permisos necesarios para ver esta página.
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 1 }}>
        Volver
      </Button>
    </Box>
  );
};

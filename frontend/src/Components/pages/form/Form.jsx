import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Container,
} from "@mui/material";

export function Form() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor, complete todos los campos");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (
        formData.email === "matias32@gmail.com" &&
        formData.password === "admin123matias"
      ) {
        console.log("Login exitoso, redirigiendo a /home");
        navigate("/home");
      } else {
        setError("Credenciales incorrectas.");
        console.log("Credenciales incorrectas");
      }
      setIsLoading(false);
    }, 100); // Reducido para pruebas rápidas
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#e3f2fd",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                IB
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" color="text.primary" fontWeight="bold">
            Instituto Medico
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema de Gestión
          </Typography>
        </Box>

        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Ingrese sus credenciales para acceder al sistema
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {error && (
                <Alert
                  severity="error"
                  sx={{ width: "100%", maxWidth: "400px" }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                id="email"
                label="Correo electrónico"
                type="email"
                fullWidth
                placeholder="usuario@institutobarrancas.edu"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{ maxWidth: "400px" }}
              />

              <TextField
                id="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        sx={{ minWidth: "auto", p: 1 }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" color="action" />
                        ) : (
                          <Visibility fontSize="small" color="action" />
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{ maxWidth: "400px" }}
              />

              <Box sx={{ width: "100%", maxWidth: "400px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        handleInputChange("rememberMe", e.target.checked)
                      }
                      disabled={isLoading}
                    />
                  }
                  label="Recordar mis credenciales"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{
                  py: 1.5,
                  maxWidth: "400px",
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Iniciando sesión...
                  </Box>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button variant="text" sx={{ fontSize: "0.875rem" }}>
                ¿Olvidó su contraseña?
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            © 2025 MC Solution. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" color="text.secondary" component="p">
            Sistema de Gestión v1.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

import React, { useState, useRef } from "react";
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
  const [loginError, setLoginError] = useState("");
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      if (validationErrors.email) {
        emailRef.current.focus();
      } else if (validationErrors.password) {
        passwordRef.current.focus();
      }
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (
        formData.email === "matias32@gmail.com" &&
        formData.password === "admin123matias"
      ) {
        navigate("/home");
      } else {
        setLoginError("Las credenciales son incorrectas.");
      }

      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Aquí aplicamos el degradado
        background: "linear-gradient(to bottom, #e0f2f7 0%, #ffffff 100%)", // Degradado azul claro a blanco
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                bgcolor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/logo.svg" // Usa el nuevo logo que generé o el que crees
                alt="MC Solutions Logo"
                style={{
                  width: "100px", // Ajusta el tamaño como necesites
                  height: "100px",
                }}
              />
            </Box>
          </Box>
          <Typography variant="h5" color="text.primary" fontWeight="bold">
            Plataforma de Gestión Clínica
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema de Gestión
          </Typography>
        </Box>

        <Card
          sx={{
            // Sombra más sutil
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
              align="center"
              gutterBottom
            >
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3, fontWeight: 300 }}
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
              noValidate
            >
              {loginError && (
                <Alert
                  severity="error"
                  sx={{ width: "100%", maxWidth: "400px" }}
                >
                  {loginError}
                </Alert>
              )}

              {/* Email */}
              <TextField
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                fullWidth
                placeholder="usuario@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                inputRef={emailRef}
                error={!!errors.email}
                helperText={errors.email || ""}
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

              {/* Password */}
              <TextField
                id="password"
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                inputRef={passwordRef}
                error={!!errors.password}
                helperText={errors.password || ""}
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
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
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
                  "&:hover": { bgcolor: "#0d47a1" },
                  "&:active": { bgcolor: "#0b3c91" },
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
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                ¿Olvidó su contraseña?
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            © 2025 MC Solution | Todos los derechos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

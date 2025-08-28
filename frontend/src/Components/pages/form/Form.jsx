import React, { useState, useRef, useEffect } from "react"; // <-- 1. Importar useRef y useEffect
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
  const [loginError, setLoginError] = useState(""); // <-- Para errores generales de login (ej: credenciales)

  // <-- 2. Estado unificado para errores de validación
  const [errors, setErrors] = useState({});

  // <-- 3. Refs para hacer foco en los inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // <-- Validación de formato más robusta
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

    // <-- 4. Lógica de validación mejorada
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // <-- 5. Lógica de foco
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
        setLoginError("Las credenciales son incorrectas."); // <-- Error específico para credenciales
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

    // <-- 6. Limpiar error del campo al modificarlo
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
        bgcolor: "#e3f2fd",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* ... (tu código del logo y título no cambia) ... */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <img
                src="/favicon.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Box>
          <Typography variant="h5" color="text.primary" fontWeight="bold">
            {" "}
            Instituto Medico{" "}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {" "}
            Sistema de Gestión{" "}
          </Typography>
        </Box>

        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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
              noValidate // <-- Desactiva la validación HTML por defecto
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
                name="email" // <-- Añadir name para el handler genérico
                label="Correo electrónico"
                type="email"
                fullWidth
                placeholder="usuario@gmail.com"
                value={formData.email}
                onChange={handleInputChange} // <-- Usar el handler genérico
                disabled={isLoading}
                inputRef={emailRef} // <-- 7. Asignar la ref al input
                error={!!errors.email} // <-- 8. Marcar error si existe en el estado
                helperText={errors.email || ""} // <-- 9. Mostrar el mensaje de error
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
                name="password" // <-- Añadir name
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange} // <-- Usar el handler genérico
                disabled={isLoading}
                inputRef={passwordRef} // <-- Asignar la ref
                error={!!errors.password} // <-- Marcar error
                helperText={errors.password || ""} // <-- Mostrar error
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
                      name="rememberMe" // <-- Añadir name
                      checked={formData.rememberMe}
                      onChange={handleInputChange} // <-- Usar el handler genérico
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
                sx={{ py: 1.5, maxWidth: "400px" /* ... */ }}
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

            {/* ... (tu código del footer no cambia) ... */}
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

import React, { useState, useRef } from "react";
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
  IconButton,
} from "@mui/material";
import { useAuth } from "../../../context/authContext";

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
  const { login } = useAuth();

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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
      return;
    }
    const validationErrors = validate();
    if (validationErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.email) emailRef.current.focus();
      else if (validationErrors.password) passwordRef.current.focus();
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || "Las credenciales son incorrectas.");
      } else {
        const userData = await response.json();
        login(userData.token, userData.user);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setLoginError("No se pudo conectar con el servidor. Intente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({});
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            component="img"
            src="/2.png"
            alt="Soluciones MC"
            sx={{ width: 112, height: 112, borderRadius: 3 }}
          />
        </Box>

        <Card>
          <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
            <Typography variant="h5" component="h1" align="center">
              Iniciar sesión
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 0.5, mb: 3 }}
            >
              Ingresá tus credenciales para acceder al sistema
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {loginError && <Alert severity="error">{loginError}</Alert>}
              <TextField
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                size="medium"
                fullWidth
                placeholder="usuario@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
                inputRef={emailRef}
                error={!!errors.email}
                helperText={errors.email || ""}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                id="password"
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                size="medium"
                fullWidth
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
                inputRef={passwordRef}
                error={!!errors.password}
                helperText={errors.password || ""}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
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
                sx={{ mt: -1 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                fullWidth
                startIcon={
                  isLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <Typography
                variant="body2"
                color="primary"
                align="center"
                sx={{ cursor: "pointer" }}
              >
                ¿Olvidaste tu contraseña?
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          component="p"
          sx={{ mt: 3 }}
        >
          © 2025 MC Solutions | Todos los derechos reservados
        </Typography>
      </Box>
    </Box>
  );
}

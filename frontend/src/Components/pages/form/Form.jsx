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
  Container,
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
        background: "linear-gradient(to bottom, #e0f2f7 0%, #ffffff 100%)",
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
                src="/2.png"
                alt="LOGO MC SOLUTIONS"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  padding: "5px",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Card
          sx={{
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
              }}
              noValidate
            >
              {loginError && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {loginError}
                </Alert>
              )}
              <TextField
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                fullWidth
                placeholder="usuario@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
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
                sx={{ mb: 2, width: "100%" }}
              />
              <TextField
                id="password"
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
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
                sx={{ width: "100%" }}
              />
              <Box sx={{ width: "100%", mt: 1 }}>
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
                  mt: 2,
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
            © 2025 MC Solutions | Todos los derechos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Collapse,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import ShieldIcon from "@mui/icons-material/Shield";

const FormSection = ({ title, description, icon, children }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      mb: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {icon}
      <Box ml={2}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
    <Divider sx={{ mb: 3 }} />
    <Grid container spacing={3} sx={{ flexGrow: 1 }}>
      {children}
    </Grid>
  </Paper>
);

export const RegistrarPaciente = () => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    DNI: "",
    Telefono: "",
    Email: "",
    FechaNacimiento: "",
    Genero: "",
    EstadoCivil: "",
    Celular: "",
    Direccion: "",
    Ciudad: "",
    Provincia: "",
    CodigoPostal: "",
    NumeroAfiliado: "",
    ID_ObraSocial: null,
    ID_Plan: null,
  });

  const [tieneObraSocial, setTieneObraSocial] = useState("");

  const [obrasSocialesList, setObrasSocialesList] = useState([]);
  const [planesList, setPlanesList] = useState([]);
  const [loadingOS, setLoadingOS] = useState(false);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    isError: false,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    setLoadingOS(true);
    fetch("http://localhost:3000/api/obras-sociales")
      .then((res) => res.json())
      .then((data) => {
        setObrasSocialesList(data);
      })
      .catch((err) => console.error("Error fetching obras sociales:", err))
      .finally(() => setLoadingOS(false));
  }, []);

  useEffect(() => {
    if (formData.ID_ObraSocial) {
      setLoadingPlanes(true);
      setPlanesList([]);
      fetch(
        `http://localhost:3000/api/obras-sociales/${formData.ID_ObraSocial}/planes`
      )
        .then((res) => res.json())
        .then((data) => {
          setPlanesList(data);
        })
        .catch((err) => console.error("Error fetching planes:", err))
        .finally(() => setLoadingPlanes(false));
    } else {
      setPlanesList([]);
    }
  }, [formData.ID_ObraSocial]);

  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:3000/api/pacientes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.FechaNacimiento) {
            data.FechaNacimiento = data.FechaNacimiento.split("T")[0];
          }
          setFormData(data);

          if (data.ID_ObraSocial) {
            setTieneObraSocial("si");
          } else {
            setTieneObraSocial("no");
          }
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseDialog = () => {
    if (!dialog.isError && dialog.title === "¡Éxito!") {
      navigate("/pacientes/consultar");
    }
    setDialog({ ...dialog, open: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = {
      Nombre: "Nombre",
      Apellido: "Apellido",
      DNI: "DNI",
      FechaNacimiento: "Fecha de Nacimiento",
      Telefono: "Teléfono",
      Celular: "Celular",
      Direccion: "Dirección",
      Ciudad: "Ciudad",
      Provincia: "Provincia",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => {
        if (key === "Telefono") {
          return (
            (!formData.Telefono || formData.Telefono.trim() === "") &&
            (!formData.Celular || formData.Celular.trim() === "")
          );
        }
        return !formData[key] || formData[key].trim() === "";
      })
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      const message = `Por favor, complete los campos obligatorios: ${missingFields.join(
        ", "
      )}. ${
        missingFields.includes("Teléfono (Fijo o Celular)")
          ? "(Se requiere al menos un teléfono)"
          : ""
      }`;
      setDialog({
        open: true,
        title: "Campos Incompletos",
        message,
        isError: true,
      });
      return;
    }

    if (!tieneObraSocial) {
      setDialog({
        open: true,
        title: "Campo Obligatorio",
        message: "Por favor, indique si el paciente tiene obra social o no.",
        isError: true,
      });
      return;
    }

    if (tieneObraSocial === "si") {
      const obraSocialFields = {
        ID_ObraSocial: "Obra Social / Prepaga",
        NumeroAfiliado: "Número de Afiliado",
        ID_Plan: "Plan",
      };

      const missingObraSocialFields = Object.entries(obraSocialFields)
        .filter(([key]) => !formData[key])
        .map(([, label]) => label);

      if (missingObraSocialFields.length > 0) {
        setDialog({
          open: true,
          title: "Campos Incompletos",
          message: `Ha indicado que tiene obra social. Por favor, complete los siguientes campos: ${missingObraSocialFields.join(
            ", "
          )}.`,
          isError: true,
        });
        return;
      }
    }

    const numberRegex = /^\d+$/;
    if (!numberRegex.test(formData.DNI)) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: "El DNI debe contener solo números.",
        isError: true,
      });
      return;
    }
    if (formData.Telefono && !numberRegex.test(formData.Telefono)) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: "El Teléfono Fijo debe contener solo números.",
        isError: true,
      });
      return;
    }
    if (formData.Celular && !numberRegex.test(formData.Celular)) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: "El Celular debe contener solo números.",
        isError: true,
      });
      return;
    }

    const MIN_DNI_LENGTH = 7;
    const MAX_DNI_LENGTH = 10;
    const MIN_PHONE_LENGTH = 6;
    const MAX_PHONE_LENGTH = 20;

    if (
      formData.DNI.length < MIN_DNI_LENGTH ||
      formData.DNI.length > MAX_DNI_LENGTH
    ) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: `El DNI debe tener entre ${MIN_DNI_LENGTH} y ${MAX_DNI_LENGTH} dígitos.`,
        isError: true,
      });
      return;
    }
    if (
      formData.Telefono &&
      (formData.Telefono.length < MIN_PHONE_LENGTH ||
        formData.Telefono.length > MAX_PHONE_LENGTH)
    ) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: `El Teléfono Fijo debe tener entre ${MIN_PHONE_LENGTH} y ${MAX_PHONE_LENGTH} dígitos.`,
        isError: true,
      });
      return;
    }
    if (
      formData.Celular &&
      (formData.Celular.length < MIN_PHONE_LENGTH ||
        formData.Celular.length > MAX_PHONE_LENGTH)
    ) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message: `El Celular debe tener entre ${MIN_PHONE_LENGTH} y ${MAX_PHONE_LENGTH} dígitos.`,
        isError: true,
      });
      return;
    }

    const today = new Date();
    const birthDate = new Date(formData.FechaNacimiento);

    today.setHours(0, 0, 0, 0);

    birthDate.setMinutes(
      birthDate.getMinutes() + birthDate.getTimezoneOffset()
    );

    if (birthDate > today) {
      setDialog({
        open: true,
        title: "Dato Inválido",
        message:
          "La fecha de nacimiento no puede ser posterior a la fecha actual.",
        isError: true,
      });
      return;
    }

    let finalFormData = { ...formData };
    if (tieneObraSocial === "no") {
      finalFormData.ID_ObraSocial = null;
      finalFormData.ID_Plan = null;
      finalFormData.NumeroAfiliado = "";
    }

    const url = isEditMode
      ? `http://localhost:3000/api/pacientes/${id}`
      : "http://localhost:3000/api/pacientes";
    const method = isEditMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalFormData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          if (res.status === 409) {
            throw new Error(errData.details);
          }
          throw new Error(errData.details || "Error al guardar paciente");
        }
        return res.json();
      })
      .then(() => {
        const message = `Paciente ${
          isEditMode ? "actualizado" : "registrado"
        } con éxito.`;
        setDialog({ open: true, title: "¡Éxito!", message, isError: false });
      })
      .catch((err) => {
        setDialog({
          open: true,
          title: "Error",
          message: err.message,
          isError: true,
        });
      });
  };

  const getObraSocialValue = () => {
    if (!formData.ID_ObraSocial) return null;
    return (
      obrasSocialesList.find(
        (os) => os.ID_ObraSocial === formData.ID_ObraSocial
      ) || null
    );
  };

  const getPlanValue = () => {
    if (!formData.ID_Plan) return null;
    return planesList.find((p) => p.ID_Plan === formData.ID_Plan) || null;
  };
  return (
    <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography component="h1" variant="h4" gutterBottom>
            {isEditMode ? "Editar Paciente" : "Registrar Nuevo Paciente"}
          </Typography>
          <Typography color="text.secondary">
            Complete el formulario con toda la información del paciente.
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <FormSection
          title="Datos Personales"
          description="Información de identificación del paciente"
          icon={<PersonIcon color="primary" />}
        >
          <Grid size={6} md={4}>
            <TextField
              name="FechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              variant="outlined"
              required
              value={formData.FechaNacimiento || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              sx={{
                "& .MuiInputLabel-outlined": {
                  backgroundColor: "white",
                },
              }}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="DNI"
              label="DNI"
              type="number"
              variant="outlined"
              value={formData.DNI || ""}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              minHeight={24}
              minWidth={193}
              maxWidth={193}
              maxHeight={24}
              InputLabelProps={{ shrink: true }}
              disabled={isEditMode}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="Nombre"
              label="Nombre"
              type="text"
              variant="outlined"
              value={formData.Nombre || ""}
              onChange={handleChange}
              fullWidth
              required
              minHeight={24}
              minWidth={193}
              maxWidth={193}
              maxHeight={24}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="Apellido"
              label="Apellido"
              type="text"
              variant="outlined"
              value={formData.Apellido || ""}
              onChange={handleChange}
              fullWidth
              required
              minHeight={24}
              minWidth={193}
              maxWidth={193}
              maxHeight={24}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Género</InputLabel>
              <Select
                name="Genero"
                value={formData.Genero || ""}
                label="Género"
                onChange={handleChange}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Estado Civil</InputLabel>
              <Select
                name="EstadoCivil"
                value={formData.EstadoCivil || ""}
                label="Estado Civil"
                onChange={handleChange}
              >
                <MenuItem value="Soltero/a">Soltero/a</MenuItem>
                <MenuItem value="Casado/a">Casado/a</MenuItem>
                <MenuItem value="Divorciado/a">Divorciado/a</MenuItem>
                <MenuItem value="Viudo/a">Viudo/a</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </FormSection>

        <FormSection
          title="Datos de Contacto"
          description="Información de contacto y domicilio"
          icon={<PhoneIcon color="success" />}
        >
          <Grid size={6} md={4}>
            <TextField
              name="Email"
              label="Email"
              type="email"
              variant="outlined"
              value={formData.Email || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="Telefono"
              label="Teléfono Fijo"
              variant="outlined"
              value={formData.Telefono || ""}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="Celular"
              label="Celular"
              variant="outlined"
              value={formData.Celular || ""}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={6} md={4}>
            <TextField
              name="Direccion"
              label="Dirección"
              variant="outlined"
              value={formData.Direccion || ""}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="Ciudad"
              label="Ciudad"
              variant="outlined"
              value={formData.Ciudad || ""}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="Provincia"
              label="Provincia"
              variant="outlined"
              value={formData.Provincia || ""}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={6} md={4}>
            <TextField
              name="CodigoPostal"
              label="Código Postal"
              variant="outlined"
              value={formData.CodigoPostal || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </FormSection>

        <FormSection
          title="Obra Social / Prepaga"
          description="Información de cobertura médica"
          icon={<ShieldIcon color="secondary" />}
        >
          <Grid size xs={12}>
            <FormControl required component="fieldset">
              <FormLabel component="legend">
                ¿Tiene Obra Social / Prepaga? *
              </FormLabel>
              <RadioGroup
                row
                value={tieneObraSocial}
                onChange={(e) => setTieneObraSocial(e.target.value)}
              >
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No (es Particular)"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size xs={12}>
            <Collapse
              in={tieneObraSocial === "si"}
              timeout="auto"
              unmountOnExit
            >
              <Grid container spacing={3}>
                <Grid size={12} md={4}>
                  <Autocomplete
                    disablePortal
                    options={obrasSocialesList}
                    getOptionLabel={(option) => option.Nombre}
                    value={getObraSocialValue()}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        ID_ObraSocial: newValue ? newValue.ID_ObraSocial : null,
                        ID_Plan: null,
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.ID_ObraSocial === value.ID_ObraSocial
                    }
                    loading={loadingOS}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Obra Social / Prepaga"
                        required={tieneObraSocial === "si"}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingOS ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}

                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12} md={4}>
                  <Autocomplete
                    disablePortal
                    options={planesList}
                    getOptionLabel={(option) => option.Nombre}
                    value={getPlanValue()}
                    disabled={!formData.ID_ObraSocial || loadingPlanes}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        ID_Plan: newValue ? newValue.ID_Plan : null,
                      });
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.ID_Plan === value.ID_Plan
                    }
                    loading={loadingPlanes}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Plan"
                        variant="outlined"
                        required={tieneObraSocial === "si"}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          ...params.InputProps,

                          endAdornment: (
                            <>
                              {loadingPlanes ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}

                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                               
                </Grid>
                             
                <Grid size={12} md={4}>
                                 
                  <TextField
                    name="NumeroAfiliado"
                    label="Número de Afiliado"
                    value={formData.NumeroAfiliado || ""}
                    onChange={handleChange}
                    fullWidth
                    required={tieneObraSocial === "si"}
                    InputLabelProps={{ shrink: true }}
                  />
                                 
                </Grid>
                             
              </Grid>
                         
            </Collapse>
                     
          </Grid>
                        
        </FormSection>

        <Box
          size={6}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}
          >
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {isEditMode ? "Actualizar Paciente" : "Registrar Paciente"}
            </Button>
          </Box>
        </Box>
        <Box size={6}></Box>
      </Box>

      <Dialog open={dialog.open} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          {dialog.isError ? (
            <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
          ) : (
            <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
          )}
          {dialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RegistrarPaciente;

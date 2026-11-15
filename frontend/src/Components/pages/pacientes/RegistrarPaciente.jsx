import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import FormContainer from "../../common/FormContainer";
import FormActions from "../../common/FormActions";
import ResultDialog from "../../common/ResultDialog";
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
  // Todos los campos de texto comparten tamaño, etiqueta fija y ancho completo.
  const field = (name, label, props = {}) => (
    <TextField
      name={name}
      label={label}
      value={formData[name] || ""}
      onChange={handleChange}
      fullWidth
      slotProps={{ inputLabel: { shrink: true } }}
      {...props}
    />
  );
  const third = { xs: 12, sm: 6, md: 4 };

  return (
    <>
      <PageHeader
        title={isEditMode ? "Editar paciente" : "Registrar paciente"}
        subtitle="Completá el formulario con la información del paciente"
        onBack={() => navigate(-1)}
      />

      <FormContainer onSubmit={handleSubmit}>
        <SectionCard
          title="Datos personales"
          description="Información de identificación del paciente"
          icon={<PersonIcon />}
        >
          <Grid container spacing={3}>
            <Grid size={third}>
              {field("Nombre", "Nombre", { required: true })}
            </Grid>
            <Grid size={third}>
              {field("Apellido", "Apellido", { required: true })}
            </Grid>
            <Grid size={third}>
              {field("DNI", "DNI", {
                required: true,
                type: "number",
                disabled: isEditMode,
              })}
            </Grid>
            <Grid size={third}>
              {field("FechaNacimiento", "Fecha de nacimiento", {
                required: true,
                type: "date",
              })}
            </Grid>
            <Grid size={third}>
              {field("Genero", "Género", {
                select: true,
                children: ["Masculino", "Femenino", "Otro"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )),
              })}
            </Grid>
            <Grid size={third}>
              {field("EstadoCivil", "Estado civil", {
                select: true,
                children: [
                  "Soltero/a",
                  "Casado/a",
                  "Divorciado/a",
                  "Viudo/a",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )),
              })}
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard
          title="Datos de contacto"
          description="Se requiere al menos un teléfono"
          icon={<PhoneIcon />}
        >
          <Grid container spacing={3}>
            <Grid size={third}>
              {field("Email", "Email", { type: "email" })}
            </Grid>
            <Grid size={third}>{field("Telefono", "Teléfono fijo")}</Grid>
            <Grid size={third}>
              {field("Celular", "Celular", { required: true })}
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              {field("Direccion", "Dirección", { required: true })}
            </Grid>
            <Grid size={third}>{field("CodigoPostal", "Código postal")}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {field("Ciudad", "Ciudad", { required: true })}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {field("Provincia", "Provincia", { required: true })}
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard
          title="Obra social / Prepaga"
          description="Información de cobertura médica"
          icon={<ShieldIcon />}
        >
          <FormControl required component="fieldset">
            <FormLabel component="legend">
              ¿Tiene obra social o prepaga?
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
                label="No (es particular)"
              />
            </RadioGroup>
          </FormControl>
          <Collapse in={tieneObraSocial === "si"} timeout="auto" unmountOnExit>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid size={third}>
                <Autocomplete
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
                      label="Obra social / Prepaga"
                      required
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingOS ? (
                                <CircularProgress color="inherit" size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={third}>
                <Autocomplete
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
                      required
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingPlanes ? (
                                <CircularProgress color="inherit" size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={third}>
                {field("NumeroAfiliado", "Número de afiliado", {
                  required: true,
                })}
              </Grid>
            </Grid>
          </Collapse>
        </SectionCard>

        <FormActions
          onCancel={() => navigate(-1)}
          submitLabel={
            isEditMode ? "Actualizar paciente" : "Registrar paciente"
          }
        />
      </FormContainer>

      <ResultDialog dialog={dialog} onClose={handleCloseDialog} />
    </>
  );
};

export default RegistrarPaciente;

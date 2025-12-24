import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const RegistrarFactura = () => {
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [serviciosFactura, setServiciosFactura] = useState([]);

  const [numeroFactura, setNumeroFactura] = useState("");
  const [metodoPagoId, setMetodoPagoId] = useState("");
  const [fechaEmision, setFechaEmision] = useState(getTodayDate());

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    isError: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/pacientes")
      .then((res) => res.json())
      .then(setPacientes);
    fetch("http://localhost:3000/api/servicios")
      .then((res) => res.json())
      .then(setServicios);
    fetch("http://localhost:3000/api/metodos-pago")
      .then((res) => res.json())
      .then(setMetodosPago);
  }, []);

  const handleCloseDialog = () => {
    if (!dialog.isError) {
      navigate("/facturacion/consultar");
    }
    setDialog({ ...dialog, open: false });
  };

  const handleAddServicio = (servicio) => {
    if (servicio) {
      setServiciosFactura([...serviciosFactura, { ...servicio, cantidad: 1 }]);
    }
  };

  const handleRemoveServicio = (index) => {
    const nuevosServicios = [...serviciosFactura];
    nuevosServicios.splice(index, 1);
    setServiciosFactura(nuevosServicios);
  };

  const calcularTotal = () => {
    return serviciosFactura.reduce(
      (total, serv) => total + serv.CostoBase * serv.cantidad,
      0
    );
  };

  const handleRegistrarFactura = () => {
    if (
      !selectedPaciente ||
      serviciosFactura.length === 0 ||
      !numeroFactura ||
      !metodoPagoId
    ) {
      setDialog({
        open: true,
        title: "Datos Incompletos",
        message:
          "Debe seleccionar un paciente, un método de pago, ingresar un n° de factura y al menos un servicio.",
        isError: true,
      });
      return;
    }

    const facturaData = {
      ID_Paciente: selectedPaciente.ID_Paciente,
      servicios: serviciosFactura,
      NumeroFactura: numeroFactura,
      ID_MetodoPago: metodoPagoId,
      FechaEmision: fechaEmision,
    };

    fetch("http://localhost:3000/api/facturacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();

          if (res.status === 409) {
            throw new Error(errorData.error);
          }
          throw new Error(
            errorData.details || "Error al registrar la factura."
          );
        }
        return res.json();
      })
      .then(() => {
        setDialog({
          open: true,
          title: "¡Éxito!",
          message: "Factura registrada exitosamente.",
          isError: false,
        });
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

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Registrar Nueva Factura
        </Typography>

        <Grid container spacing={3}>
          <Grid size={12} md={4}>
            <Autocomplete
              options={pacientes}
              getOptionLabel={(option) =>
                `${option.Apellido}, ${option.Nombre} (DNI: ${option.DNI})`
              }
              onChange={(event, newValue) => setSelectedPaciente(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar Paciente *"
                  sx={{ "& .MuiInputBase-input": { minHeight: 40 } }}
                />
              )}
            />
          </Grid>
          <Grid size={12} md={4}>
            <Autocomplete
              options={servicios}
              getOptionLabel={(option) =>
                `${option.Nombre} ($${option.CostoBase})`
              }
              onChange={(event, newValue) => handleAddServicio(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Agregar Servicio a la Factura *"
                  sx={{ "& .MuiInputBase-input": { minHeight: 40 } }}
                />
              )}
              value={null}
            />
          </Grid>
          <Grid size={12} md={6}>
            <TextField
              label="Número de Factura"
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              placeholder="Ej: 0001-00001234"
              fullWidth
              required
              sx={{ "& .MuiInputBase-input": { minHeight: 40 } }}
            />
          </Grid>

          <Grid size={12} md={6}>
            <FormControl
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { height: 56.5 } }}
            >
              <InputLabel>Método de Pago *</InputLabel>
              <Select
                value={metodoPagoId}
                label="Método de Pago"
                onChange={(e) => setMetodoPagoId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Seleccione un método</em>
                </MenuItem>
                {metodosPago.map((metodo) => (
                  <MenuItem
                    key={metodo.ID_MetodoPago}
                    value={metodo.ID_MetodoPago}
                  >
                    {metodo.Nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12} md={6}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Detalle de la Factura
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Servicio</TableCell>
                    <TableCell align="right">Costo Unitario</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviciosFactura.map((servicio, index) => (
                    <TableRow key={index}>
                      <TableCell>{servicio.Nombre}</TableCell>
                      <TableCell align="right">
                        ${servicio.CostoBase.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">1</TableCell>
                      <TableCell align="right">
                        ${(servicio.CostoBase * servicio.cantidad).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveServicio(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography fontWeight="bold">TOTAL:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        ${calcularTotal().toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleRegistrarFactura}>
                Registrar Factura
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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

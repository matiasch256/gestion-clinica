import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Skeleton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const DetalleFactura = () => {
  const { facturaId } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/facturacion/${facturaId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setFactura(data))
      .catch((error) => {
        console.error("Error al cargar el detalle de la factura:", error);
        setFactura(null);
      })
      .finally(() => setLoading(false));
  }, [facturaId]);

  const getStatusChip = (estado) => {
    /* ... (puedes copiar la función de ListadoFacturas) ... */
  };
  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (!factura) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Factura no encontrada
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Detalle de Factura N° {factura.ID_FacturaPaciente}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Paciente
            </Typography>
            <Typography variant="body1">
              {factura.ApellidoPaciente}, {factura.NombrePaciente}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DNI: {factura.DNI}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Datos de la Factura
            </Typography>
            <Typography variant="body1">
              Fecha:{" "}
              {new Date(factura.FechaEmision).toLocaleDateString("es-AR")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                Estado:
              </Typography>
              <Chip
                label={factura.Estado}
                color={factura.Estado === "Pagada" ? "success" : "warning"}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Servicios Facturados
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Servicio</TableCell>
              <TableCell align="right">Precio Unitario</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {factura.detalles.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.Servicio}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.PrecioUnitario)}
                </TableCell>
                <TableCell align="center">{item.Cantidad}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.SubTotal)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ "& td": { border: 0, fontWeight: "bold" } }}>
              <TableCell colSpan={3} align="right">
                TOTAL
              </TableCell>
              <TableCell align="right">
                {formatCurrency(factura.Total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mt: 3 }}
      >
        Volver a la Lista
      </Button>
    </Box>
  );
};

export default DetalleFactura;

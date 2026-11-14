import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import DetailItem from "../../common/DetailItem";
import StatusChip from "../../common/StatusChip";
import EmptyState from "../../common/EmptyState";
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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  if (loading) {
    return <Skeleton variant="rounded" height={320} />;
  }

  if (!factura) {
    return (
      <EmptyState
        title="Factura no encontrada"
        action={
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Volver
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title={`Factura #${factura.ID_FacturaPaciente}`}
        subtitle="Detalle de la factura"
        onBack={() => navigate(-1)}
        actions={
          <StatusChip status={factura.Estado} sx={{ textTransform: "none" }} />
        }
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SectionCard title="Datos de la factura">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DetailItem
                label="Paciente"
                value={`${factura.ApellidoPaciente}, ${factura.NombrePaciente}`}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <DetailItem label="DNI" value={factura.DNI} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 3 }}>
              <DetailItem
                label="Fecha de emisión"
                value={new Date(factura.FechaEmision).toLocaleDateString(
                  "es-AR"
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <DetailItem label="Total">
                <Typography variant="h5" component="span">
                  {formatCurrency(factura.Total)}
                </Typography>
              </DetailItem>
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard title="Servicios facturados" disablePadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Servicio</TableCell>
                <TableCell align="right">Precio unitario</TableCell>
                <TableCell align="right">Cantidad</TableCell>
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
                  <TableCell align="right">{item.Cantidad}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(item.SubTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </Box>
    </>
  );
};

export default DetalleFactura;

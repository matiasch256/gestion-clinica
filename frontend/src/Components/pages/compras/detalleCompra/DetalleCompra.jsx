import SectionCard from "../../../common/SectionCard";
import DetailItem from "../../../common/DetailItem";
import StatusChip from "../../../common/StatusChip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PageHeader from "../../../common/PageHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Paper,
  Typography,
  Box,
  Skeleton,
  Grid,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StoreIcon from "@mui/icons-material/Store";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function DetalleCompra() {
  const { idCompra } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/compras/${idCompra}`)
      .then((res) => res.json())
      .then((data) => {
        setCompra(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el detalle:", error);
        setLoading(false);
      });
  }, [idCompra]);

  if (loading) {
    return (
      <>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 4 }}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          </Grid>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ mt: 4 }}
          />
        </Paper>
      </>
    );
  }

  if (!compra) {
    return (
      <>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            No se encontró la compra solicitada.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Volver al listado
          </Button>
        </Paper>
      </>
    );
  }

  const total = compra.productos.reduce(
    (acc, p) => acc + p.Cantidad * p.Precio,
    0
  );

  return (
    <>
      <PageHeader
        title={`Compra #${compra.id}`}
        subtitle="Detalle de la orden de compra"
        onBack={() => navigate(-1)}
        actions={
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/compras/modificar/${compra.id}`)}
          >
            Editar
          </Button>
        }
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <SectionCard title="Datos de la compra">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DetailItem
                label="Fecha de compra"
                value={new Date(compra.fecha).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DetailItem label="Proveedor" value={compra.proveedorNombre} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <DetailItem label="Estado">
                <StatusChip status={compra.estado || "Activo"} />
              </DetailItem>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DetailItem label="Monto total">
                <Typography variant="h5" component="span">
                  ${total.toFixed(2)}
                </Typography>
              </DetailItem>
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard title="Productos adquiridos" disablePadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Precio unit.</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compra.productos.map((p, i) => (
                <TableRow key={i} hover>
                  <TableCell>{p.NombreProducto}</TableCell>
                  <TableCell align="right">${p.Precio.toFixed(2)}</TableCell>
                  <TableCell align="right">{p.Cantidad}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${(p.Precio * p.Cantidad).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </Box>
    </>
  );
}

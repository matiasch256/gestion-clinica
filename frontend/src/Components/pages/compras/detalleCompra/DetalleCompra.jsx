import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles"; // Importar theme
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
  const theme = useTheme();
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
      <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid item xs={4}>
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
      </Box>
    );
  }

  if (!compra) {
    return (
      <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper
          elevation={0}
          sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
        >
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
      </Box>
    );
  }

  const total = compra.productos.reduce(
    (acc, p) => acc + p.Cantidad * p.Precio,
    0
  );

  return (
    <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "700",
              color: theme.palette.text.primary,
            }}
          >
            Detalle de Compra N° {compra.id}
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CalendarTodayIcon
                sx={{ color: theme.palette.primary.main, fontSize: 30 }}
              />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  FECHA DE COMPRA
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {new Date(compra.fecha).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <StoreIcon
                sx={{
                  color: theme.palette.accent.orange || "#fd7e14",
                  fontSize: 30,
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  PROVEEDOR
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {compra.proveedorNombre}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Total */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <AttachMoneyIcon
                sx={{ color: theme.palette.accent.green, fontSize: 30 }}
              />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  MONTO TOTAL
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h6"
          component="h2"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: theme.palette.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReceiptLongIcon /> Productos Adquiridos
        </Typography>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.background.paper }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Producto
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Precio Unit.
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Cantidad
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compra.productos.map((p, i) => (
                <TableRow key={i} hover>
                  <TableCell>{p.NombreProducto}</TableCell>
                  <TableCell>${p.Precio.toFixed(2)}</TableCell>
                  <TableCell>{p.Cantidad}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    ${(p.Precio * p.Cantidad).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.background.trasparent,
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                backgroundColor: `${theme.palette.primary.main}10`, // 10% opacidad
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            Volver
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

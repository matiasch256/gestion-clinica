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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
      <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          <Skeleton variant="text" width="30%" />
        </Typography>
        <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
          <Table>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="20%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="20%" />
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="90%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="70%" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  if (!compra) {
    return (
      <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h6" color="error">
          No se encontró la compra
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

  const total = compra.productos.reduce(
    (acc, p) => acc + p.Cantidad * p.Precio,
    0
  );

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Compra N° {compra.id}
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Fecha:</b>{" "}
                {new Date(compra.fecha).toLocaleDateString("es-AR")}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Proveedor:</b> {compra.proveedorNombre}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Total: </b>${total.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Productos
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compra.productos.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.NombreProducto}</TableCell>
                <TableCell>${p.Precio.toFixed(2)}</TableCell>
                <TableCell>{p.Cantidad}</TableCell>
                <TableCell>${(p.Precio * p.Cantidad).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          height: 50,
          mt: 3,
          backgroundColor: "#1976d2 !important",
          "&:hover": { backgroundColor: "#115293 !important" },
          color: "#fff !important",
        }}
      >
        Volver
      </Button>
    </Box>
  );
}

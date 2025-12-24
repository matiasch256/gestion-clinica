import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Skeleton,
  Chip,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InventoryIcon from "@mui/icons-material/Inventory";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import QrCodeIcon from "@mui/icons-material/QrCode";
import StraightenIcon from "@mui/icons-material/Straighten";
import WarningIcon from "@mui/icons-material/Warning";

export function DetalleProducto() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el detalle del producto:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={60} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  if (!producto) {
    return (
      <Box sx={{ padding: 3, maxWidth: "100%", margin: "0 auto" }}>
        <Paper
          elevation={0}
          sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            No se encontró el producto
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: "transparent",
              fontWeight: "bold",
              px: 4,
              py: 1,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}10`,
              },
            }}
          >
            VOLVER
          </Button>
        </Paper>
      </Box>
    );
  }

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
        {/* CABECERA */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "700",
              color: theme.palette.text.primary,
              borderLeft: `5px solid ${theme.palette.primary.main}`,
              paddingLeft: 2,
            }}
          >
            Detalle del Producto: {producto.nombre}
          </Typography>

          <Chip
            label={producto.activo ? "Activo" : "Inactivo"}
            color={producto.activo ? "success" : "error"}
            variant="outlined"
            sx={{ fontWeight: "bold", bgcolor: "transparent" }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Información General
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  DESCRIPCIÓN
                </Typography>
                <Typography variant="body1">
                  {producto.descripcion || "Sin descripción"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    <QrCodeIcon fontSize="small" />
                    <Typography variant="caption">CÓDIGO</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {producto.codigo || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    <CategoryIcon fontSize="small" />
                    <Typography variant="caption">CATEGORÍA ID</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {producto.categoriaId || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color:
                    theme.palette.secondary?.main || theme.palette.text.primary,
                }}
              >
                <InventoryIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Inventario
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    STOCK ACTUAL
                  </Typography>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {producto.stock}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                      color: theme.palette.warning.main,
                    }}
                  >
                    <WarningIcon fontSize="small" />
                    <Typography variant="caption" fontWeight="bold">
                      STOCK MÍNIMO
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.primary">
                    {producto.stockMinimo}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StraightenIcon color="action" />
                <Typography variant="body2">
                  Unidad de Medida: <strong>{producto.unidadMedida}</strong>
                </Typography>
              </Box>

              {producto.observaciones && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    OBSERVACIONES
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    "{producto.observaciones}"
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.background.trasparent,
              fontWeight: "bold",
              px: 4,
              py: 1,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}10`,
              },
            }}
          >
            VOLVER
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default DetalleProducto;

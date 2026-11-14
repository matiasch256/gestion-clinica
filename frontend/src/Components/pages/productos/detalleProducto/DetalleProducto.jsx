import SectionCard from "../../../common/SectionCard";
import DetailItem from "../../../common/DetailItem";
import StatusChip from "../../../common/StatusChip";
import { getStockStatus } from "../../../../utils/stock";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PageHeader from "../../../common/PageHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      <>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
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
      </>
    );
  }

  if (!producto) {
    return (
      <>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" color="error" gutterBottom>
            No se encontró el producto
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              px: 4,
              py: 1,
            }}
          >
            VOLVER
          </Button>
        </Paper>
      </>
    );
  }

  const stockStatus = getStockStatus(producto.stock, producto.stockMinimo);

  return (
    <>
      <PageHeader
        title={producto.nombre}
        subtitle="Detalle del producto"
        onBack={() => navigate(-1)}
        actions={
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() =>
              navigate(`/productos/modificar/${producto.id || id}`)
            }
          >
            Editar
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            title="Información general"
            icon={<DescriptionIcon />}
            sx={{ height: "100%" }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <DetailItem
                  label="Descripción"
                  value={producto.descripcion || "Sin descripción"}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <DetailItem label="Código" value={producto.codigo || "N/A"} />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <DetailItem
                  label="Categoría (ID)"
                  value={producto.categoriaId || "N/A"}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <DetailItem label="Estado">
                  <StatusChip
                    status={producto.activo ? "Activo" : "Inactivo"}
                  />
                </DetailItem>
              </Grid>
              {producto.observaciones && (
                <Grid size={{ xs: 12 }}>
                  <DetailItem
                    label="Observaciones"
                    value={producto.observaciones}
                  />
                </Grid>
              )}
            </Grid>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            title="Inventario"
            icon={<InventoryIcon />}
            sx={{ height: "100%" }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <DetailItem label="Stock actual">
                  <Typography variant="h4" component="span">
                    {producto.stock}
                  </Typography>
                </DetailItem>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem label="Estado de stock">
                  <StatusChip
                    color={stockStatus.tone}
                    status={stockStatus.label}
                    sx={{ textTransform: "none", mt: 1 }}
                  />
                </DetailItem>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem label="Stock mínimo" value={producto.stockMinimo} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailItem
                  label="Unidad de medida"
                  value={producto.unidadMedida}
                />
              </Grid>
            </Grid>
          </SectionCard>
        </Grid>
      </Grid>
    </>
  );
}

export default DetalleProducto;

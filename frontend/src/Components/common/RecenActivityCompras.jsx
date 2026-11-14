import { Box, Grid, Typography } from "@mui/material";
import SectionCard from "./SectionCard";
import StatusChip from "./StatusChip";
import EmptyState from "./EmptyState";

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "$0.00";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

const Row = ({ first, title, detail, value, chip }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      px: 3,
      py: 1.5,
      borderTop: first ? 0 : 1,
      borderColor: "divider",
    }}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" noWrap>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {detail}
      </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="subtitle2" noWrap>
        {value}
      </Typography>
      {chip}
    </Box>
  </Box>
);

const RecentActivityCompras = ({ ordenes = [], productos = [] }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, lg: 7 }}>
      <SectionCard
        title="Órdenes recientes"
        disablePadding
        sx={{ height: "100%" }}
      >
        {ordenes.length === 0 ? (
          <EmptyState title="No hay órdenes recientes" />
        ) : (
          ordenes.map((orden, index) => (
            <Row
              key={orden.id}
              first={index === 0}
              title={`Compra #${orden.id}`}
              detail={orden.proveedorNombre}
              value={formatCurrency(orden.total)}
              chip={<StatusChip status={orden.estado} />}
            />
          ))
        )}
      </SectionCard>
    </Grid>

    <Grid size={{ xs: 12, lg: 5 }}>
      <SectionCard
        title="Productos con stock bajo"
        disablePadding
        sx={{ height: "100%" }}
      >
        {productos.length === 0 ? (
          <EmptyState title="No hay productos con stock bajo" />
        ) : (
          productos.map((producto, index) => (
            <Row
              key={index}
              first={index === 0}
              title={producto.nombre}
              detail="Stock actual"
              chip={
                <StatusChip
                  color="error"
                  status={`${producto.stock} unidades`}
                  sx={{ textTransform: "none" }}
                />
              }
            />
          ))
        )}
      </SectionCard>
    </Grid>
  </Grid>
);

export default RecentActivityCompras;

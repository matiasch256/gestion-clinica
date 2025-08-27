import { Card, CardContent, CardHeader } from "@mui/material";
import { Button, Typography, Box, Grid, Chip } from "@mui/material";

export default function RecentActivityCompras() {
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card>
          <CardHeader
            title={<Typography variant="h6">Órdenes Recientes</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  id: "ORD-001",
                  proveedor: "Proveedor ABC",
                  monto: "$45,200",
                  estado: "Pendiente",
                },
                {
                  id: "ORD-002",
                  proveedor: "Distribuidora XYZ",
                  monto: "$32,100",
                  estado: "Aprobada",
                },
                {
                  id: "ORD-003",
                  proveedor: "Suministros DEF",
                  monto: "$18,900",
                  estado: "En proceso",
                },
              ].map((orden) => (
                <Box
                  key={orden.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {orden.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {orden.proveedor}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body1" fontWeight="medium">
                      {orden.monto}
                    </Typography>
                    <Chip
                      label={orden.estado}
                      size="small"
                      sx={{
                        backgroundColor:
                          orden.estado === "Pendiente"
                            ? "#FFF8E1"
                            : orden.estado === "Aprobada"
                            ? "#E8F5E9"
                            : "#E3F2FD",
                        color:
                          orden.estado === "Pendiente"
                            ? "warning.main"
                            : orden.estado === "Aprobada"
                            ? "success.main"
                            : "info.main",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h6">Productos con Stock Bajo</Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  nombre: "Papel A4",
                  stock: 15,
                  minimo: 50,
                  unidad: "paquetes",
                },
                {
                  nombre: "Tóner HP LaserJet",
                  stock: 2,
                  minimo: 10,
                  unidad: "unidades",
                },
                {
                  nombre: "Cuadernos Universitarios",
                  stock: 8,
                  minimo: 25,
                  unidad: "unidades",
                },
              ].map((producto, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mínimo: {producto.minimo} {producto.unidad}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body1"
                      color="error.main"
                      fontWeight="medium"
                    >
                      {producto.stock} {producto.unidad}
                    </Typography>
                    <Chip
                      label="Stock crítico"
                      size="small"
                      sx={{ backgroundColor: "#FFEBEE", color: "error.main" }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

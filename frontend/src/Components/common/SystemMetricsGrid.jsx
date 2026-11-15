import { Grid } from "@mui/material";
import StatCard from "./StatCard";

// Fila de métricas: todas las tarjetas con el mismo ancho y alto.
// Cada métrica: { title, value, caption, icon, tone }
const SystemMetricsGrid = ({ systemMetrics }) => {
  const columns = systemMetrics.length % 3 === 0 ? 4 : 3;
  return (
    <Grid container spacing={3}>
      {systemMetrics.map((metric) => (
        <Grid key={metric.title} size={{ xs: 12, sm: 6, lg: columns }}>
          <StatCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SystemMetricsGrid;

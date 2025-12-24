import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

export default function DashboardContent({
  title = "Dashboard",
  cards = [],
  actions = [],
}) {
  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {Array.isArray(cards) && cards.length > 0 ? (
          cards.map((card, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              {card}
            </Grid>
          ))
        ) : (
          <Typography>No hay tarjetas disponibles</Typography>
        )}
      </Grid>

      {Array.isArray(actions) && actions.length > 0 && (
        <Card elevation={3} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Acciones Rápidas</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {actions.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

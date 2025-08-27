import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const SystemMetricsGrid = ({ systemMetrics }) => {
  return (
    <Grid container spacing={2} sx={{ pt: 3 }}>
      {" "}
      {systemMetrics.map((metric, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          {" "}
          <Card
            sx={{
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {" "}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  {" "}
                  <Typography variant="body2" color="text.primary">
                    {metric.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {metric.value}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {" "}
                    {metric.trending === "up" && (
                      <TrendingUpIcon
                        sx={{ fontSize: "12px", color: "#4caf50" }}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {metric.change}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: metric.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <metric.icon sx={{ fontSize: "20px", color: metric.color }} />{" "}
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {metric.description ? metric.description : ""}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SystemMetricsGrid;

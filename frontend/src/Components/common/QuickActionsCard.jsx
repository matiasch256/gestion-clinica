import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Grid,
  Typography,
  Box,
} from "@mui/material";

const QuickActionsCard = ({ quickActions }) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader
        title={<Typography variant="h6">Acciones Rápidas</Typography>}
      />
      <CardContent>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Button
                variant="contained"
                sx={{
                  height: "100%",
                  width: "90%",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  backgroundColor: `${action.color} !important`,
                  "&:hover": {
                    backgroundColor: `${action.colorHover} !important`,
                    opacity: 4,
                  },
                  textTransform: "none",
                  borderRadius: "8px",
                }}
                onClick={action.action}
              >
                <action.icon sx={{ fontSize: "24px", color: "white" }} />
                <Box textAlign="center">
                  <Typography
                    variant="body2"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;

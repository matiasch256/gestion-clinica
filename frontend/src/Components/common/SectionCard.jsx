import { Box, Divider, Paper, Typography } from "@mui/material";

// Agrupa contenido relacionado bajo un mismo título (proximidad).
const SectionCard = ({
  title,
  description,
  icon,
  action,
  children,
  disablePadding = false,
  sx,
}) => (
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", ...sx }}>
    {title && (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {icon && (
              <Box sx={{ display: "flex", color: "primary.main" }}>{icon}</Box>
            )}
            <Box>
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Box>
          </Box>
          {action}
        </Box>
        <Divider />
      </>
    )}
    <Box sx={disablePadding ? undefined : { p: 3 }}>{children}</Box>
  </Paper>
);

export default SectionCard;

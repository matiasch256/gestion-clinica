import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

const EmptyState = ({
  icon,
  title = "No hay datos para mostrar",
  description,
  action,
}) => {
  const Icon = icon || InboxOutlinedIcon;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        py: 6,
        px: 2,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Icon sx={{ fontSize: 40, color: "neutral.500" }} />
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {description && <Typography variant="body2">{description}</Typography>}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;

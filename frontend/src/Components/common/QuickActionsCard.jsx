import { useNavigate } from "react-router-dom";
import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SectionCard from "./SectionCard";
import { useAuth } from "../../context/authContext";

// Accesos directos. Todos con el mismo aspecto y el color de marca:
// se distinguen por el ícono y el texto, no por el color.
// Cada acción: { title, description, icon, path, roles? }
const QuickActionsCard = ({ quickActions, title = "Acciones rápidas" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const visible = quickActions.filter(
    (action) => !action.roles || action.roles.includes(user?.Rol)
  );
  if (visible.length === 0) return null;

  return (
    <SectionCard title={title}>
      <Grid container spacing={2}>
        {visible.map((action) => (
          <Grid key={action.path} size={{ xs: 12, sm: 6 }}>
            <ButtonBase
              onClick={() => navigate(action.path)}
              sx={{
                width: "100%",
                p: 1.5,
                gap: 1.5,
                justifyContent: "flex-start",
                textAlign: "left",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                transition: "border-color 0.2s, background-color 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.lighter",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "primary.lighter",
                  color: "primary.main",
                }}
              >
                <action.icon fontSize="small" />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2">{action.title}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {action.description}
                </Typography>
              </Box>
              <ChevronRightIcon fontSize="small" color="action" />
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </SectionCard>
  );
};

export default QuickActionsCard;

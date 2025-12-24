import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Box, CircularProgress } from "@mui/material";

export const RoleBasedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const tienePermiso = allowedRoles.includes(user.Rol);

  return tienePermiso ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

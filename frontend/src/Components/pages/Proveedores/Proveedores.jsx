import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Link, Outlet, useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)({
  width: "100%",
  backgroundColor: "#000000",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: "100%",
}));

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/home" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/Proveedores" },
  {
    text: "Registrar Proveedor",
    icon: <PeopleIcon />,
    path: "/Proveedores/registrar",
  },
  {
    text: "Consultar Proveedor",
    icon: <PeopleIcon />,
    path: "/Proveedores/consultar",
  },
];

export const Proveedores = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/barrancas-logo.png" alt="Logo" style={{ height: 40 }} />
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                ml: 4,
                "&:hover": {
                  color: "#ffffff",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Spacer para empujar elementos a la derecha */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Información de sesión */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Bienvenida, Laura
            </Typography>
            <IconButton
              color="inherit"
              sx={{ mr: 2, "&:hover": { color: "#ffffff" } }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Módulo Proveedores
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* Sección de usuario en el drawer */}
        <Box sx={{ p: 2, textAlign: "center", backgroundColor: "grey.50" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Usuario Actual
          </Typography>
          <Typography variant="body2" color="text.secondary">
            laura_barrancas@gmail.com
          </Typography>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleMenuClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Sección de sesión */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuClick("/perfil")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Mi Perfil" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                /* Lógica de logout */
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main>
        <DrawerHeader />
        <Outlet />{" "}
        {/* Renderiza subpáginas como ProveedoresDashBoard, RegistrarProveedor, etc. */}
      </Main>
    </Box>
  );
};

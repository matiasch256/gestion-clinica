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
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

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
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

export default function MainLayout({ title = "App", menuItems = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ saber ruta actual
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
                "&:hover": { color: theme.palette.sidebar.active },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Bienvenida, Laura
            </Typography>
            <IconButton
              color="inherit"
              sx={{
                mr: 2,
                "&:hover": { color: theme.palette.sidebar.active },
              }}
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
            backgroundColor: theme.palette.sidebar.background,
            color: theme.palette.sidebar.text,
            borderRight: `1px solid ${theme.palette.sidebar.border}`,
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
            Menú
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
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            backgroundColor: theme.palette.sidebar.hover,
          }}
        >
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
              <ListItemButton
                onClick={() => handleMenuClick(item.path)}
                selected={location.pathname === item.path} // ✅ compara ruta
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.sidebar.hover,
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.sidebar.active,
                    color: theme.palette.primary.contrastText,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.contrastText,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick("/perfil")}
              selected={location.pathname === "/perfil"} // ✅ también perfil
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.sidebar.hover,
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.sidebar.active,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
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
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.error.contrastText,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}

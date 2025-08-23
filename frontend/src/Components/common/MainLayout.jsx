import React, { useState } from "react";
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
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.primary.contrastText,
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
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [iconHover, setIconHover] = useState(theme.palette.error.main);
  const [openMenu, setOpenMenu] = useState({});

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSubMenuClick = (text) => {
    setOpenMenu((prev) => ({ ...prev, [text]: !prev[text] }));
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
                bgcolor: "transparent !important",
                "&:hover": { color: theme.palette.sidebar.active },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "divider.main" }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Bienvenida, Laura
            </Typography>
            <IconButton
              color="inherit"
              sx={{
                mr: 2,
                bgcolor: "transparent !important",
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
            backgroundColor: theme.palette.background.paper,
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
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              bgcolor: "transparent !important",
              "&:hover": { color: theme.palette.sidebar.active },
            }}
          >
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
            textAlign: "left",
            backgroundColor: theme.palette.sidebar.hover,
            display: "flex",
          }}
        >
          <AccountCircleIcon
            sx={{
              mr: 4,
              alignSelf: "center",
              bgcolor: "transparent !important",
            }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Laura Rodríguez
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrador
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.children ? (
                <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                      "& .MuiListItemText-primary": {
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSubMenuClick(item.text)}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.sidebar.hover,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openMenu[item.text] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              ) : (
                <ListItem
                  disablePadding
                  sx={{
                    "&:hover": {
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                      "& .MuiListItemText-primary": {
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleMenuClick(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.sidebar.hover,
                      },
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.sidebar.hover,
                        color: theme.palette.sidebar.active,
                        "& .MuiListItemIcon-root": {
                          color: theme.palette.sidebar.active,
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
              )}
              {item.children && (
                <Collapse in={openMenu[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, i) => (
                      <ListItem
                        key={i}
                        disablePadding
                        sx={{
                          "&:hover": {
                            "& .MuiListItemIcon-root": {
                              color: "primary.main",
                            },
                            "& .MuiListItemText-primary": {
                              color: "primary.main",
                            },
                          },
                        }}
                      >
                        <ListItemButton
                          sx={{
                            pl: 4,
                            "&:hover": {
                              backgroundColor: theme.palette.sidebar.hover,
                            },
                            "&.Mui-selected": {
                              backgroundColor: theme.palette.sidebar.hover,
                              color: theme.palette.sidebar.active,
                              "& .MuiListItemIcon-root": {
                                color: theme.palette.sidebar.active,
                              },
                            },
                          }}
                          selected={location.pathname === child.path}
                          onClick={() => handleMenuClick(child.path)}
                        >
                          {child.icon && (
                            <ListItemIcon
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              {child.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{
              "&:hover": {
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
                "& .MuiListItemText-primary": {
                  color: "primary.main",
                },
              },
            }}
          >
            <ListItemButton
              onClick={() => handleMenuClick("/perfil")}
              selected={location.pathname === "/perfil"}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.sidebar.hover,
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.sidebar.hover,
                  color: theme.palette.sidebar.active,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.sidebar.active,
                  },
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
              onMouseEnter={() =>
                setIconHover(theme.palette.error.contrastText)
              }
              onMouseLeave={() => setIconHover(theme.palette.error.main)}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.error.main,
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon sx={{ color: iconHover }} />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" sx={{ color: iconHover }} />
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

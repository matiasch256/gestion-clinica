import React, { useState, useMemo } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../context/authContext";
import { ROLES } from "../../utils/roles";

const drawerWidth = 279;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1) !important",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function MainLayout({ title = "App", menuItems = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [iconHover, setIconHover] = useState(theme.palette.error.main);
  const [openMenu, setOpenMenu] = useState({});
  const { user, logout } = useAuth();

  const filteredMenuItems = useMemo(() => {
    if (!user || !user.Rol) return [];

    return menuItems
      .filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(user.Rol);
      })
      .map((item) => {
        if (!item.children) return item;

        const visibleChildren = item.children.filter((child) => {
          if (!child.roles) return true;

          return child.roles.includes(user.Rol);
        });

        return { ...item, children: visibleChildren };
      })

      .filter((item) => !item.children || item.children.length > 0);
  }, [menuItems, user]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleSubMenuClick = (text) => {
    setOpenMenu((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const handleLogout = () => {
    logout();
  };

  const getAvatarInitial = () => {
    if (!user || !user.Nombre) return "?";
    const names = user.Nombre.split(" ");
    if (names.length > 1 && names[1].length > 0) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.Nombre[0].toUpperCase();
  };

  const getGreeting = () => {
    if (!user) return "";

    let greeting = "Bienvenido/a";

    if (user.Genero === "Femenino") {
      greeting = "Bienvenida";
    } else if (user.Genero === "Masculino") {
      greeting = "Bienvenido";
    }

    return `${greeting}, ${user.Nombre}`;
  };
  return (
    <Box sx={{ display: "flex" }}>
            <CssBaseline />     
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
               
        <Toolbar>
                   
          <Box sx={{ display: "flex", alignItems: "center" }}>
                       
            <img
              src="./icono.png"
              alt="Logo Mc Solutions"
              style={{ height: 45, marginRight: 10 }}
            />
                       
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                ml: 16,
                bgcolor: "transparent !important",
                "&:hover": { color: theme.palette.sidebar.active },
              }}
            >
              <MenuIcon sx={{ width: 24, height: 24 }} />           
            </IconButton>
                     
          </Box>
                   
          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "divider.main", mx: 3.8 }}
          />
          <Box sx={{ flexGrow: 1 }} />         
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                       
            <Typography
              variant="subtitle2"
              sx={{
                mr: 2,
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
              }}
            >
                            {getGreeting()}           
            </Typography>
                       
            <IconButton
              color="inherit"
              sx={{ p: 0, bgcolor: "transparent !important" }}
            >
                           
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                                {getAvatarInitial()}             
              </Avatar>
                         
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
            mt: "64px",

            height: "calc(100% - 64px)",
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
               
        <DrawerHeader>
                   
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Menú          
          </Typography>
                 
        </DrawerHeader>
                <Divider />       
        <Box
          sx={{
            p: 2,
            textAlign: "left",
            display: "flex",
            alignItems: "center",
          }}
        >
                   
          <Avatar
            sx={{ width: 32, height: 32, mr: 2, bgcolor: "primary.main" }}
          >
                        {getAvatarInitial()}         
          </Avatar>
                   
          <Box>
                       
            <Typography variant="subtitle1" fontWeight="bold">
                            {user ? user.Nombre : "Cargando..."}           
            </Typography>
                       
            <Typography variant="body2" color="text.secondary">
                            {user ? user.Rol : ""}           
            </Typography>
                     
          </Box>
                 
        </Box>
                <Divider />       
        <List>
                   
          {filteredMenuItems.map((item, index) => (
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
                      ...(openMenu[item.text] && {
                        "& .MuiListItemIcon-root": {
                          color: theme.palette.sidebar.active,
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.sidebar.active,
                        },
                      }),
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
                              sx={{
                                color: openMenu[item.text]
                                  ? theme.palette.sidebar.active
                                  : theme.palette.text.secondary,
                              }}
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
                   
                <IconButton color="inherit" sx={{ p: 0 }}>
                     
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                        {getAvatarInitial()}   
                  </Avatar>
                     
                </IconButton>
                   
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
              onClick={handleLogout}
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
       
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(open && {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }}
      >
            <Toolbar />
            <Outlet /> 
      </Box>
       
    </Box>
  );
}

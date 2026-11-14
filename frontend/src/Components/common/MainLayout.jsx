import { Fragment, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/authContext";
import { MENU_SECTIONS } from "../pages/home/homeMenuItems";
import { PAGE_MAX_WIDTH } from "../../theme/theme";

const DRAWER_WIDTH = 264;
const ICON_COLUMN = 40;

// Estilo único para todos los ítems del menú (repetición).
const navItemSx = {
  mx: 1,
  my: 0.25,
  py: 0.75,
  borderRadius: 2,
  color: "text.secondary",
  "& .MuiListItemIcon-root": { minWidth: ICON_COLUMN, color: "inherit" },
  "&:hover": { bgcolor: "primary.lighter", color: "primary.main" },
  "&.Mui-selected, &.Mui-selected:hover": {
    bgcolor: "primary.lighter",
    color: "primary.main",
  },
  "&.Mui-selected .MuiListItemText-primary": { fontWeight: 600 },
};

const firstSegment = (path = "") => path.split("/")[1] || "";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  return initials.toUpperCase();
};

export default function MainLayout({ menuItems = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [drawerOpen, setDrawerOpen] = useState(isDesktop);
  const [openGroups, setOpenGroups] = useState({});
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const visibleItems = useMemo(() => {
    if (!user?.Rol) return [];
    const allowed = (entry) => !entry.roles || entry.roles.includes(user.Rol);

    return menuItems
      .filter(allowed)
      .map((item) =>
        item.children
          ? { ...item, children: item.children.filter(allowed) }
          : item
      )
      .filter((item) => !item.children || item.children.length > 0);
  }, [menuItems, user]);

  // El módulo de la pantalla actual: se resalta y se abre solo.
  const activeGroup = useMemo(() => {
    const current = firstSegment(location.pathname);
    const match = visibleItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => firstSegment(child.path) === current)
    );
    return match?.text;
  }, [visibleItems, location.pathname]);

  useEffect(() => {
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup]: true }));
    }
  }, [activeGroup]);

  useEffect(() => {
    setDrawerOpen(isDesktop);
  }, [isDesktop]);

  const goTo = (path) => {
    navigate(path);
    if (!isDesktop) setDrawerOpen(false);
  };

  const toggleGroup = (text) =>
    setOpenGroups((prev) => ({ ...prev, [text]: !prev[text] }));

  const renderItem = (item) => {
    if (!item.children) {
      return (
        <ListItemButton
          key={item.text}
          selected={location.pathname === item.path}
          onClick={() => goTo(item.path)}
          sx={navItemSx}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      );
    }

    const isOpen = Boolean(openGroups[item.text]);
    const isActive = activeGroup === item.text;

    return (
      <Fragment key={item.text}>
        <ListItemButton
          onClick={() => toggleGroup(item.text)}
          aria-expanded={isOpen}
          sx={{
            ...navItemSx,
            ...(isActive && { color: "primary.main" }),
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.text}
            slotProps={{
              primary: { sx: { fontWeight: isActive ? 600 : 400 } },
            }}
          />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => (
              <ListItemButton
                key={child.path}
                selected={location.pathname === child.path}
                onClick={() => goTo(child.path)}
                sx={{ ...navItemSx, pl: `${16 + ICON_COLUMN}px`, py: 0.5 }}
              >
                <ListItemText
                  primary={child.text}
                  slotProps={{ primary: { variant: "body2" } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Fragment>
    );
  };

  const ungrouped = visibleItems.filter((item) => !item.section);
  const sections = MENU_SECTIONS.map((name) => ({
    name,
    items: visibleItems.filter((item) => item.section === name),
  })).filter((section) => section.items.length > 0);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton
            edge="start"
            aria-label="Mostrar u ocultar el menú"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/icono.png"
            alt=""
            sx={{ width: 36, height: 36, borderRadius: 2 }}
          />
          <Typography variant="h6" component="div" noWrap>
            Gestión Clínica
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <ButtonBase
            onClick={(event) => setUserMenuAnchor(event.currentTarget)}
            aria-label="Menú de usuario"
            aria-haspopup="menu"
            sx={{ gap: 1.5, p: 0.5, borderRadius: 2, textAlign: "right" }}
          >
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="subtitle2" noWrap>
                {user?.Nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.Rol}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {getInitials(user?.Nombre)}
            </Avatar>
          </ButtonBase>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                setUserMenuAnchor(null);
                logout();
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? "persistent" : "temporary"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: isDesktop && drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.shorter,
          }),
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <Toolbar />
        <Box component="nav" aria-label="Menú principal" sx={{ py: 1 }}>
          <List disablePadding>{ungrouped.map(renderItem)}</List>
          {sections.map((section) => (
            <List
              key={section.name}
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{
                    mt: 2,
                    lineHeight: "32px",
                    typography: "caption",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {section.name}
                </ListSubheader>
              }
            >
              {section.items.map(renderItem)}
            </List>
          ))}
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3 }}>
        <Toolbar />
        <Box sx={{ maxWidth: PAGE_MAX_WIDTH, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

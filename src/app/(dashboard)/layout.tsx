// src/app/(dashboard)/layout.tsx
"use client";

import { ReactNode } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Mail,
  Folder,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  Dashboard,
  ChevronLeft,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import { useUiStore } from "../../stores/uiStore";

const drawerWidth = 280;

// Elementos del menú principal
const menuItems = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
    permission: null,
  },
  {
    text: "Correspondencia",
    icon: <Mail />,
    path: "/correspondencia",
    permission: { resource: "correspondence", action: "read" },
  },
  {
    text: "Archivo",
    icon: <Folder />,
    path: "/archivo",
    permission: { resource: "file-unit", action: "read" },
  },
  {
    text: "Préstamos",
    icon: <Settings />,
    path: "/prestamos",
    permission: { resource: "loan", action: "read" },
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, hasPermission } = useAuth();
  const { sidebarOpen, toggleSidebar, setSidebarCollapsed } = useUiStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    router.push("/login");
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Filtrar elementos del menú según permisos
  const filteredMenuItems = menuItems.filter(
    (item) =>
      !item.permission ||
      hasPermission(item.permission.resource, item.permission.action)
  );

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header del drawer */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          SCA
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap>
            Correspondencia
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sistema de Archivo
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => setSidebarCollapsed(!sidebarOpen)}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Menú principal */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleMenuItemClick(item.path)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.text === "Correspondencia" ? (
                  <Badge badgeContent={3} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer del drawer */}
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMenuItemClick("/configuracion")}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "background.paper",
            color: "text.primary",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleSidebar}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Breadcrumbs o título de página */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {pathname === "/correspondencia" && "Correspondencia"}
              {pathname === "/archivo" && "Archivo"}
              {pathname === "/prestamos" && "Préstamos"}
              {pathname === "/dashboard" && "Dashboard"}
            </Typography>

            {/* Notificaciones */}
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={5} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Menú de usuario */}
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {user?.initials || "U"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2">{user?.fullName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role} • {user?.area}
                </Typography>
              </Box>

              <MenuItem onClick={() => router.push("/perfil")}>
                <AccountCircle sx={{ mr: 2 }} />
                Mi Perfil
              </MenuItem>

              <MenuItem onClick={() => router.push("/configuracion")}>
                <Settings sx={{ mr: 2 }} />
                Configuración
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 2 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={sidebarOpen}
            onClose={toggleSidebar}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
            backgroundColor: "background.default",
          }}
        >
          <Toolbar /> {/* Spacing for AppBar */}
          <Box sx={{ p: 3 }}>{children}</Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}

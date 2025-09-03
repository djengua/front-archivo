// src/hooks/useAuth.ts
import { useAuthStore } from "../stores/authStore";
import { useUiStore } from "../stores/uiStore";
import { LoginCredentials } from "../types/common.types";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAuth,
    checkAuth,
    clearError,
    updateUser,
    hasPermission,
    isTokenExpired,
  } = useAuthStore();

  const { addNotification } = useUiStore();

  // Wrapper para login con notificaciones
  const loginWithNotification = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      addNotification({
        type: "success",
        title: "¡Bienvenido!",
        message: `Hola ${credentials.username}, sesión iniciada correctamente`,
      });
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "Error de autenticación",
        message: error?.message || "No se pudo iniciar sesión",
      });
      throw error;
    }
  };

  // Wrapper para logout con notificaciones
  const logoutWithNotification = () => {
    const userName = user?.firstName || user?.username || "";
    logout();

    addNotification({
      type: "info",
      title: "Sesión cerrada",
      message: userName
        ? `Hasta luego, ${userName}`
        : "Sesión cerrada correctamente",
    });
  };

  // Función para verificar múltiples permisos
  const hasAnyPermission = (
    permissions: Array<{ resource: string; action: string }>
  ) => {
    return permissions.some(({ resource, action }) =>
      hasPermission(resource, action)
    );
  };

  // Función para verificar todos los permisos
  const hasAllPermissions = (
    permissions: Array<{ resource: string; action: string }>
  ) => {
    return permissions.every(({ resource, action }) =>
      hasPermission(resource, action)
    );
  };

  // Getter para información del usuario formateada
  const userInfo = user
    ? {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        role: user.role.name,
        area: user.area,
        initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
        isActive: user.isActive,
      }
    : null;

  // Función para verificar si el usuario puede acceder a un módulo
  const canAccessModule = (
    module: "correspondence" | "archive" | "loans" | "admin"
  ) => {
    switch (module) {
      case "correspondence":
        return hasPermission("correspondence", "read");
      case "archive":
        return hasPermission("file-unit", "read");
      case "loans":
        return hasPermission("loan", "read");
      case "admin":
        return hasPermission("user", "manage");
      default:
        return false;
    }
  };

  // Estados derivados útiles
  const authStatus = {
    isLoggedIn: isAuthenticated && !!user,
    isLoading,
    hasError: !!error,
    needsRefresh: isAuthenticated && isTokenExpired(),
  };

  return {
    // Estado
    user: userInfo,
    isAuthenticated,
    isLoading,
    error,
    authStatus,

    // Acciones principales
    login: loginWithNotification,
    logout: logoutWithNotification,
    refreshAuth,
    checkAuth,
    clearError,
    updateUser,

    // Utilidades de permisos
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,

    // Estados derivados
    isTokenExpired,
  };
};

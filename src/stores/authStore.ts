// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import {
  User,
  TokenPayload,
  LoginCredentials,
  AuthResponse,
  AppError,
  logError,
} from "../types";
import { authService } from "../services/auth.service";

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;

  // Utilidades
  hasPermission: (resource: string, action: string) => boolean;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.login(credentials);
          const { user, token, refreshToken } = response;

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al iniciar sesión",
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      logout: () => {
        // Llamar al servicio para invalidar el token en el backend
        authService.logout().catch(console.error);

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshAuth: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await authService.refresh(refreshToken);
          const { user, token, refreshToken: newRefreshToken } = response;

          set({
            user,
            token,
            refreshToken: newRefreshToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Failed to refresh token:", error);
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        const { token, isTokenExpired, refreshAuth } = get();

        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          if (isTokenExpired()) {
            await refreshAuth();
          } else {
            // Token válido, verificar que el usuario sigue existiendo
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          logError(error as AppError, "AuthStore.checkAuth");
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      // Utilidades
      hasPermission: (resource: string, action: string) => {
        const { user } = get();
        if (!user || !user.role) return false;

        return user.role.permissions.some(
          (permission) =>
            permission.resource === resource && permission.action === action
        );
      },

      isTokenExpired: () => {
        const { token } = get();
        if (!token) return true;

        try {
          const decoded: TokenPayload = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // Considerar expirado 5 minutos antes del tiempo real de expiración
          return decoded.exp < currentTime + 300;
        } catch (error) {
          console.error("Error decoding token:", error);
          return true;
        }
      },
    }),
    {
      name: "correspondence-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

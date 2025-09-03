// src/stores/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeName, ThemeMode } from "../theme";

interface UiState {
  // Tema
  themeName: ThemeName;
  themeMode: ThemeMode;

  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Notifications
  notifications: Notification[];

  // Actions
  setTheme: (themeName: ThemeName, mode?: ThemeMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  timestamp: Date;
  autoHide?: boolean;
  duration?: number; // en ms
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      themeName: "default",
      themeMode: "light",
      sidebarOpen: true,
      sidebarCollapsed: false,
      isLoading: false,
      loadingMessage: "",
      notifications: [],

      // Actions
      setTheme: (themeName, mode) =>
        set((state) => ({
          themeName,
          themeMode: mode || state.themeMode,
        })),

      setThemeMode: (themeMode) => set({ themeMode }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      setLoading: (isLoading, loadingMessage = "") =>
        set({
          isLoading,
          loadingMessage,
        }),

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          autoHide: notification.autoHide !== false, // por defecto true
          duration: notification.duration || 5000,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications.slice(0, 4)], // máximo 5
        }));

        // Auto-remove si está configurado
        if (newNotification.autoHide) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "correspondence-ui-config", // nombre para localStorage
      partialize: (state) => ({
        themeName: state.themeName,
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }), // solo persiste estas propiedades
    }
  )
);

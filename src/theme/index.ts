// src/theme/index.ts
"use client";

import { createTheme, ThemeOptions } from "@mui/material/styles";
import {
  lightPalette,
  darkPalette,
  governmentPalette,
  corporatePalette,
  modernPalette,
} from "./palette";
import { typography } from "./typography";

// Tipo para los temas disponibles
export type ThemeName = "default" | "government" | "corporate" | "modern";
export type ThemeMode = "light" | "dark";

// Función para obtener la paleta según el tema seleccionado
const getPalette = (themeName: ThemeName, mode: ThemeMode) => {
  const basePalette = mode === "light" ? lightPalette : darkPalette;

  switch (themeName) {
    case "government":
      return { ...basePalette, ...governmentPalette };
    case "corporate":
      return { ...basePalette, ...corporatePalette };
    case "modern":
      return { ...basePalette, ...modernPalette };
    default:
      return basePalette;
  }
};

// Configuración base del tema
const getThemeOptions = (
  themeName: ThemeName = "default",
  mode: ThemeMode = "light"
): ThemeOptions => ({
  palette: {
    mode,
    ...getPalette(themeName, mode),
  },

  typography,

  shape: {
    borderRadius: 8,
  },

  spacing: 8,

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontSize: "0.875rem",
          fontWeight: 500,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: "0.75rem",
          fontWeight: 500,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
          boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

// Hook para crear el tema
export const createAppTheme = (
  themeName: ThemeName = "default",
  mode: ThemeMode = "light"
) => {
  return createTheme(getThemeOptions(themeName, mode));
};

// Tema por defecto
export const defaultTheme = createAppTheme();

// Configuración de temas disponibles para el selector
export const availableThemes = {
  default: {
    name: "Corporativo",
    description: "Tema corporativo profesional",
    primary: "#1976d2",
    secondary: "#388e3c",
  },
  government: {
    name: "Gubernamental",
    description: "Tema institucional",
    primary: "#2c5aa0",
    secondary: "#8bc34a",
  },
  corporate: {
    name: "Ejecutivo",
    description: "Tema corporativo ejecutivo",
    primary: "#1a237e",
    secondary: "#ff6f00",
  },
  modern: {
    name: "Moderno",
    description: "Tema moderno y fresco",
    primary: "#6366f1",
    secondary: "#10b981",
  },
} as const;

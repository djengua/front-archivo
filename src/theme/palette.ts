// src/theme/palette.ts
export const lightPalette = {
  primary: {
    main: "#1976d2", // Azul corporativo
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#388e3c", // Verde complementario
    light: "#66bb6a",
    dark: "#2e7d32",
    contrastText: "#ffffff",
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#ffffff",
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
    contrastText: "#ffffff",
  },
  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
    contrastText: "#ffffff",
  },
  background: {
    default: "#fafafa",
    paper: "#ffffff",
  },
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#bdbdbd",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
};

export const darkPalette = {
  ...lightPalette,
  background: {
    default: "#121212",
    paper: "#1e1e1e",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b0b0b0",
    disabled: "#666666",
  },
};

// Paletas alternativas que podrás cambiar fácilmente
export const governmentPalette = {
  primary: { main: "#2c5aa0" }, // Azul gobierno
  secondary: { main: "#8bc34a" }, // Verde institucional
};

export const corporatePalette = {
  primary: { main: "#1a237e" }, // Azul corporativo oscuro
  secondary: { main: "#ff6f00" }, // Naranja ejecutivo
};

export const modernPalette = {
  primary: { main: "#6366f1" }, // Indigo moderno
  secondary: { main: "#10b981" }, // Esmeralda
};

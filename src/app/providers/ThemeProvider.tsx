// src/app/providers/ThemeProvider.tsx
"use client";

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { esES } from "@mui/x-date-pickers/locales";
import { es } from "date-fns/locale";
import { createAppTheme } from "../../theme";
import { useUiStore } from "../../stores/uiStore";
import { NotificationProvider } from "./NotificationProvider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeName, themeMode } = useUiStore();
  const theme = createAppTheme(themeName, themeMode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={es}
        localeText={
          esES.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <NotificationProvider>{children}</NotificationProvider>
      </LocalizationProvider>
    </MuiThemeProvider>
  );
}

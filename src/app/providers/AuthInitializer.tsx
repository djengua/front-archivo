// src/app/providers/AuthInitializer.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useUiStore } from "../../stores/uiStore";
import { CircularProgress, Box, Typography } from "@mui/material";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { checkAuth, isAuthenticated, token } = useAuthStore();
  const { setLoading } = useUiStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true, "Verificando sesión...");

        if (token) {
          await checkAuth();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [token, checkAuth, setLoading]);

  if (!isInitialized) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Cargando aplicación...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

// src/app/(auth)/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LoginForm } from "../../../components/forms/LoginForm";
import { useAuthStore } from "../../../stores/authStore";

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/correspondencia");
    }
  }, [isAuthenticated, router]);

  // No mostrar la página de login si ya está autenticado
  if (isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Logo/Header institucional */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: "transparent",
              textAlign: "center",
              mb: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              color="primary.main"
              fontWeight="bold"
              gutterBottom
            >
              Sistema de Correspondencia
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gestión Integral de Documentos y Archivo
            </Typography>
          </Paper>

          {/* Formulario de login */}
          <LoginForm />

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            © 2024 Sistema de Correspondencia y Archivo
            <br />
            Versión 1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

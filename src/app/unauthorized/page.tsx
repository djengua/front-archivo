// src/app/unauthorized/page.tsx
"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Lock, ArrowBack } from "@mui/icons-material";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Lock
            sx={{
              fontSize: 64,
              color: "warning.main",
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom>
            Acceso Denegado
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            No tienes los permisos necesarios para acceder a esta página.
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            Si crees que esto es un error, contacta al administrador del
            sistema.
          </Alert>

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
            >
              Volver
            </Button>

            <Button
              variant="contained"
              onClick={() => router.push("/correspondencia")}
            >
              Ir al Inicio
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

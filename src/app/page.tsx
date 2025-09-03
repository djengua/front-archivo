// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { CircularProgress, Box } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirigir según el estado de autenticación
    if (isAuthenticated) {
      router.replace("/correspondencia");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Mostrar loading mientras se decide la redirección
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}

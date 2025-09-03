// src/components/layout/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuthStore } from "../../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
}

export function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasPermission, checkAuth } = useAuthStore();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Verificar autenticación
        if (!isAuthenticated) {
          await checkAuth();
        }

        if (!isAuthenticated) {
          // Guardar la ruta intentada para redirigir después del login
          sessionStorage.setItem("redirectAfterLogin", pathname);
          router.replace("/login");
          return;
        }

        // Verificar permisos si se requieren
        if (requiredPermission) {
          const { resource, action } = requiredPermission;
          if (!hasPermission(resource, action)) {
            router.replace("/unauthorized");
            return;
          }
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Error checking access:", error);
        router.replace("/login");
      }
    };

    checkAccess();
  }, [
    isAuthenticated,
    pathname,
    router,
    checkAuth,
    hasPermission,
    requiredPermission,
  ]);

  // Mostrar loading mientras se verifica el acceso
  if (isChecking || !isAuthenticated) {
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
          Verificando acceso...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

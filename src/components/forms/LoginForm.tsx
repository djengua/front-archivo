// src/components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  Divider,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../schemas/auth.schemas";
import { useAuthStore } from "../../stores/authStore";
import { useUiStore } from "../../stores/uiStore";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { login, error, clearError } = useAuthStore();
  const { addNotification } = useUiStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      await login(data);

      addNotification({
        type: "success",
        title: "Bienvenido",
        message: "Sesión iniciada correctamente",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/correspondencia");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al iniciar sesión";

      if (errorMessage.includes("credenciales")) {
        setError("password", {
          type: "manual",
          message: "Usuario o contraseña incorrectos",
        });
      } else {
        addNotification({
          type: "error",
          title: "Error de autenticación",
          message: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Credenciales demo para desarrollo
  const demoCredentials = [
    { username: "admin", password: "admin123", role: "Administrador" },
    { username: "mesa.entrada", password: "mesa123", role: "Mesa de Entrada" },
    {
      username: "resp.juridica",
      password: "juridica123",
      role: "Responsable Jurídica",
    },
  ];

  return (
    <Card
      sx={{
        maxWidth: 400,
        width: "100%",
        boxShadow: (theme) => theme.shadows[8],
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <LoginIcon
            sx={{
              fontSize: 48,
              color: "primary.main",
              mb: 1,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema de Correspondencia y Archivo
          </Typography>
        </Box>

        {/* Error global */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulario */}
        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{ width: "100%" }}
        >
          {/* Campo Usuario */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Usuario"
                placeholder="Ingresa tu usuario"
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Campo Contraseña */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
            )}
          />

          {/* Botón de envío */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? undefined : <LoginIcon />}
            sx={{ mb: 2, py: 1.5 }}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          {/* Enlaces adicionales */}
          <Box textAlign="center">
            <Link
              href="#"
              variant="body2"
              color="primary"
              sx={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                addNotification({
                  type: "info",
                  title: "Función no disponible",
                  message: "Contacta al administrador del sistema",
                });
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Box>

        {/* Credenciales demo (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <>
            <Divider sx={{ my: 3 }}>
              <Chip
                label="Credenciales Demo"
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Divider>

            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Para pruebas (solo desarrollo):
              </Typography>

              {demoCredentials.map((cred, index) => (
                <Box key={index} mb={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      // Auto-rellenar formulario
                      handleSubmit(() => handleLogin(cred))();
                    }}
                    disabled={isSubmitting}
                    sx={{
                      justifyContent: "flex-start",
                      fontSize: "0.75rem",
                      textTransform: "none",
                    }}
                  >
                    {cred.username} - {cred.role}
                  </Button>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

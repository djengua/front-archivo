// src/schemas/auth.schemas.ts
import { z } from "zod";

// Esquema para login
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El usuario es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(50, "El usuario no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "El usuario solo puede contener letras, números, puntos, guiones y guiones bajos"
    ),

  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

// Esquema para registro de usuario (si se implementa más adelante)
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(50, "El usuario no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "El usuario solo puede contener letras, números, puntos, guiones y guiones bajos"
      ),

    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Formato de email inválido")
      .max(100, "El email no puede exceder 100 caracteres"),

    firstName: z
      .string()
      .min(1, "El nombre es requerido")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras y espacios"
      ),

    lastName: z
      .string()
      .min(1, "El apellido es requerido")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El apellido solo puede contener letras y espacios"
      ),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
      ),

    confirmPassword: z.string(),

    area: z
      .string()
      .min(1, "El área es requerida")
      .max(100, "El área no puede exceder 100 caracteres"),

    roleId: z.string().min(1, "El rol es requerido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Esquema para cambio de contraseña
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),

    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
      .max(100, "La nueva contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
      ),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  });

// Esquema para solicitud de recuperación de contraseña
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
});

// Esquema para reseteo de contraseña
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token de recuperación requerido"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Esquema para actualización de perfil
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),

  lastName: z
    .string()
    .min(1, "El apellido es requerido")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El apellido solo puede contener letras y espacios"
    ),

  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido")
    .max(100, "El email no puede exceder 100 caracteres"),

  area: z
    .string()
    .min(1, "El área es requerida")
    .max(100, "El área no puede exceder 100 caracteres"),
});

// Esquema para validación de token
export const validateTokenSchema = z.object({
  token: z.string().min(1, "Token requerido"),
});

// Esquema para refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token requerido"),
});

// Esquema para verificación de dos factores (2FA) - para futuras implementaciones
export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código solo puede contener números"),
});

// Tipos inferidos de los esquemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ValidateTokenFormData = z.infer<typeof validateTokenSchema>;
export type RefreshTokenFormData = z.infer<typeof refreshTokenSchema>;
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

// Funciones de validación personalizadas
export const validatePassword = (password: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

export const validateUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9._-]+$/.test(username);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Mensajes de validación personalizados
export const ValidationMessages = {
  REQUIRED: "Este campo es requerido",
  INVALID_EMAIL: "Formato de email inválido",
  INVALID_USERNAME: "Usuario inválido",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 6 caracteres",
  PASSWORD_TOO_WEAK:
    "La contraseña debe contener mayúsculas, minúsculas y números",
  PASSWORDS_DONT_MATCH: "Las contraseñas no coinciden",
  PASSWORD_SAME_AS_CURRENT:
    "La nueva contraseña debe ser diferente a la actual",
} as const;

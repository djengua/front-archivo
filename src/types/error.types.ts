// src/types/error.types.ts

// Tipos para manejo de errores
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: string[];
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      code?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
}

// Tipo para errores de validación
export interface ValidationError {
  field: string;
  message: string;
}

// Tipo union para diferentes tipos de error
export type AppError = Error | ApiErrorResponse | string | unknown;

// src/utils/error-handler.ts

/**
 * Extrae un mensaje de error legible de diferentes tipos de error
 */
export function extractErrorMessage(
  error: AppError,
  defaultMessage = "Ha ocurrido un error"
): string {
  // Si es un string, retornarlo directamente
  if (typeof error === "string") {
    return error;
  }

  // Si es un Error nativo
  if (error instanceof Error) {
    return error.message;
  }

  // Si es un objeto con estructura de error de API
  if (typeof error === "object" && error !== null) {
    const errorObj = error as ApiErrorResponse;

    // Prioridad: mensaje de respuesta API > mensaje general > mensaje por defecto
    const apiMessage = errorObj.response?.data?.message;
    const generalMessage = errorObj.message;

    return apiMessage || generalMessage || defaultMessage;
  }

  return defaultMessage;
}

/**
 * Determina si un error es relacionado con autenticación
 */
export function isAuthError(error: AppError): boolean {
  const message = extractErrorMessage(error).toLowerCase();
  const authKeywords = [
    "credenciales",
    "usuario",
    "contraseña",
    "password",
    "authentication",
    "unauthorized",
    "token",
    "sesión",
  ];

  return authKeywords.some((keyword) => message.includes(keyword));
}

/**
 * Determina si un error es de validación
 */
export function isValidationError(error: AppError): boolean {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as ApiErrorResponse;
    return (
      errorObj.response?.status === 400 || errorObj.response?.status === 422
    );
  }
  return false;
}

/**
 * Extrae errores de validación de una respuesta de API
 */
export function extractValidationErrors(error: AppError): ValidationError[] {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as ApiErrorResponse;
    const errors = errorObj.response?.data?.errors;

    if (Array.isArray(errors)) {
      return errors.map((err, index) => ({
        field: `field_${index}`,
        message: typeof err === "string" ? err : "Error de validación",
      }));
    }
  }

  return [];
}

/**
 * Crea un error personalizado para la aplicación
 */
export function createAppError(
  message: string,
  code?: string,
  status?: number
): ApiError {
  return {
    message,
    code,
    status,
  };
}

/**
 * Logger de errores centralizado
 */
export function logError(error: AppError, context?: string): void {
  const message = extractErrorMessage(error);
  const timestamp = new Date().toISOString();

  console.error(
    `[${timestamp}] Error${context ? ` in ${context}` : ""}: ${message}`
  );

  // En producción, aquí podrías enviar a un servicio de logging
  if (process.env.NODE_ENV === "production") {
    // Ejemplo: enviar a Sentry, LogRocket, etc.
  }
}

// Constantes para códigos de error comunes
export const ERROR_CODES = {
  // Autenticación
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Validación
  VALIDATION_ERROR: "VALIDATION_ERROR",
  REQUIRED_FIELD: "REQUIRED_FIELD",

  // Red
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",

  // Recursos
  NOT_FOUND: "NOT_FOUND",
  PERMISSION_DENIED: "PERMISSION_DENIED",

  // Servidor
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

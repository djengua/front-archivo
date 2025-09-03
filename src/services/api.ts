// src/services/api.ts
import axios from "axios";

// Configuración base de Axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag para usar mock data o API real
export const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL;

// Interceptor de request para agregar token JWT
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (se ejecuta en cliente)
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("correspondence-auth");
      if (authData) {
        try {
          const { token } = JSON.parse(authData).state;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("correspondence-auth");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

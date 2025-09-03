// src/services/auth.service.ts
import {
  LoginCredentials,
  AuthResponse,
  User,
  TokenPayload,
} from "../types/common.types";
import { api, USE_MOCK_DATA } from "./api";
import { findUserByCredentials, mockUsers } from "./mock/users.mock";

// Simulación de delay para mock
const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generar token JWT falso para desarrollo
const generateMockToken = (user: User): string => {
  const payload: TokenPayload = {
    sub: user.id,
    username: user.username,
    role: user.role.name,
    area: user.area,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
  };

  // En un JWT real, esto sería firmado correctamente
  const mockToken = `mock.${btoa(JSON.stringify(payload))}.signature`;
  return mockToken;
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await mockDelay();

      const user = findUserByCredentials(
        credentials.username,
        credentials.password
      );

      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      if (!user.isActive) {
        throw new Error("Usuario inactivo");
      }

      const token = generateMockToken(user);
      const refreshToken = `refresh_${token}`;

      return {
        user,
        token,
        refreshToken,
        expiresIn: 24 * 60 * 60, // 24 horas en segundos
      };
    } else {
      // API real
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    }
  }

  async logout(): Promise<void> {
    if (USE_MOCK_DATA) {
      await mockDelay(200);
      return;
    } else {
      await api.post("/auth/logout");
    }
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await mockDelay(300);

      // Extraer información del token mock
      try {
        const parts = refreshToken.replace("refresh_", "").split(".");
        const payload = JSON.parse(atob(parts[1]));
        const user = mockUsers.find((u) => u.id === payload.sub);

        if (!user || !user.isActive) {
          throw new Error("Usuario no encontrado o inactivo");
        }

        const newToken = generateMockToken(user);
        const newRefreshToken = `refresh_${newToken}`;

        return {
          user,
          token: newToken,
          refreshToken: newRefreshToken,
          expiresIn: 24 * 60 * 60,
        };
      } catch (error) {
        throw new Error("Token de actualización inválido");
      }
    } else {
      const response = await api.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    }
  }

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK_DATA) {
      await mockDelay(200);

      // Obtener usuario actual del token almacenado
      if (typeof window !== "undefined") {
        const authData = localStorage.getItem("correspondence-auth");
        if (authData) {
          try {
            const { user } = JSON.parse(authData).state;
            const currentUser = mockUsers.find((u) => u.id === user?.id);
            if (currentUser && currentUser.isActive) {
              return currentUser;
            }
          } catch (error) {
            console.error("Error parsing stored user:", error);
          }
        }
      }

      throw new Error("Usuario no encontrado");
    } else {
      const response = await api.get<User>("/auth/me");
      return response.data;
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (USE_MOCK_DATA) {
      await mockDelay();

      // Simulación básica - en un caso real validaríamos la contraseña actual
      if (currentPassword.length < 6 || newPassword.length < 6) {
        throw new Error("Contraseña debe tener al menos 6 caracteres");
      }

      return;
    } else {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await mockDelay();

      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        // No revelar si el email existe o no por seguridad
        return;
      }

      console.log("Mock: Password reset email sent to:", email);
      return;
    } else {
      await api.post("/auth/forgot-password", { email });
    }
  }
}

export const authService = new AuthService();

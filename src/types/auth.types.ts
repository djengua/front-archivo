import { User } from "./common.types";

// src/types/auth.types.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string; // userId
  username: string;
  role: string;
  area: string;
  iat: number;
  exp: number;
}

// src/services/mock/users.mock.ts
import { User, UserRole, Permission } from "../../types/common.types";

// Permisos del sistema
export const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "Ver correspondencia",
    resource: "correspondence",
    action: "read",
  },
  {
    id: "2",
    name: "Crear correspondencia",
    resource: "correspondence",
    action: "create",
  },
  {
    id: "3",
    name: "Editar correspondencia",
    resource: "correspondence",
    action: "update",
  },
  {
    id: "4",
    name: "Eliminar correspondencia",
    resource: "correspondence",
    action: "delete",
  },
  {
    id: "5",
    name: "Turnar correspondencia",
    resource: "correspondence",
    action: "route",
  },
  {
    id: "6",
    name: "Cerrar correspondencia",
    resource: "correspondence",
    action: "close",
  },
  { id: "7", name: "Ver expedientes", resource: "file-unit", action: "read" },
  {
    id: "8",
    name: "Crear expedientes",
    resource: "file-unit",
    action: "create",
  },
  { id: "9", name: "Ver préstamos", resource: "loan", action: "read" },
  {
    id: "10",
    name: "Autorizar préstamos",
    resource: "loan",
    action: "authorize",
  },
  {
    id: "11",
    name: "Administrar usuarios",
    resource: "user",
    action: "manage",
  },
  { id: "12", name: "Ver auditoría", resource: "audit", action: "read" },
];

// Roles del sistema
export const mockRoles: UserRole[] = [
  {
    id: "admin",
    name: "Administrador",
    permissions: mockPermissions, // Todos los permisos
  },
  {
    id: "mesa-entrada",
    name: "Mesa de Entrada",
    permissions: mockPermissions.filter(
      (p) =>
        p.resource === "correspondence" &&
        ["read", "create", "update", "route"].includes(p.action)
    ),
  },
  {
    id: "responsable",
    name: "Responsable de Área",
    permissions: mockPermissions.filter((p) =>
      ["correspondence", "file-unit"].includes(p.resource)
    ),
  },
  {
    id: "archivista",
    name: "Archivista",
    permissions: mockPermissions.filter((p) =>
      ["correspondence", "file-unit", "loan"].includes(p.resource)
    ),
  },
  {
    id: "consultor",
    name: "Consultor",
    permissions: mockPermissions.filter((p) => p.action === "read"),
  },
];

// Usuarios del sistema
export const mockUsers: User[] = [
  {
    id: "admin-001",
    username: "admin",
    email: "admin@correspondencia.gov",
    firstName: "Carlos",
    lastName: "Administrador",
    role: mockRoles[0], // Admin
    area: "Sistemas",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mesa-001",
    username: "mesa.entrada",
    email: "mesa@correspondencia.gov",
    firstName: "María",
    lastName: "González",
    role: mockRoles[1], // Mesa de Entrada
    area: "Mesa de Entrada",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "resp-001",
    username: "resp.juridica",
    email: "juridica@correspondencia.gov",
    firstName: "Ana",
    lastName: "Martínez",
    role: mockRoles[2], // Responsable
    area: "Área Jurídica",
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "resp-002",
    username: "resp.rrhh",
    email: "rrhh@correspondencia.gov",
    firstName: "Luis",
    lastName: "Rodríguez",
    role: mockRoles[2], // Responsable
    area: "Recursos Humanos",
    isActive: true,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "arch-001",
    username: "archivista",
    email: "archivo@correspondencia.gov",
    firstName: "Patricia",
    lastName: "López",
    role: mockRoles[3], // Archivista
    area: "Archivo Central",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

// Credenciales de prueba (para desarrollo)
export const mockCredentials = [
  { username: "admin", password: "admin123" },
  { username: "mesa.entrada", password: "mesa123" },
  { username: "resp.juridica", password: "juridica123" },
  { username: "resp.rrhh", password: "rrhh123" },
  { username: "archivista", password: "archivo123" },
];

// Función auxiliar para buscar usuario
export const findUserByCredentials = (
  username: string,
  password: string
): User | null => {
  const validCredential = mockCredentials.find(
    (cred) => cred.username === username && cred.password === password
  );

  if (!validCredential) return null;

  return mockUsers.find((user) => user.username === username) || null;
};

// Función para obtener usuarios por área
export const getUsersByArea = (area: string): User[] => {
  return mockUsers.filter((user) => user.area === area && user.isActive);
};

// Función para buscar usuarios
export const searchUsers = (query: string): User[] => {
  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(
    (user) =>
      user.isActive &&
      (user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.area.toLowerCase().includes(lowerQuery))
  );
};

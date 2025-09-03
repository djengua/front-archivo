// src/utils/constants.ts

// Estados de correspondencia
export const CORRESPONDENCE_STATUSES = {
  DRAFT: "draft",
  REGISTERED: "registered",
  ROUTED: "routed",
  IN_PROGRESS: "inProgress",
  ANSWERED: "answered",
  CLOSED: "closed",
} as const;

export const CORRESPONDENCE_STATUS_LABELS = {
  [CORRESPONDENCE_STATUSES.DRAFT]: "Borrador",
  [CORRESPONDENCE_STATUSES.REGISTERED]: "Registrada",
  [CORRESPONDENCE_STATUSES.ROUTED]: "Turnada",
  [CORRESPONDENCE_STATUSES.IN_PROGRESS]: "En Trámite",
  [CORRESPONDENCE_STATUSES.ANSWERED]: "Respondida",
  [CORRESPONDENCE_STATUSES.CLOSED]: "Cerrada",
};

export const CORRESPONDENCE_STATUS_COLORS = {
  [CORRESPONDENCE_STATUSES.DRAFT]: "default",
  [CORRESPONDENCE_STATUSES.REGISTERED]: "info",
  [CORRESPONDENCE_STATUSES.ROUTED]: "warning",
  [CORRESPONDENCE_STATUSES.IN_PROGRESS]: "primary",
  [CORRESPONDENCE_STATUSES.ANSWERED]: "secondary",
  [CORRESPONDENCE_STATUSES.CLOSED]: "success",
} as const;

// Tipos de correspondencia
export const CORRESPONDENCE_TYPES = {
  INCOMING: "incoming",
  OUTGOING: "outgoing",
} as const;

export const CORRESPONDENCE_TYPE_LABELS = {
  [CORRESPONDENCE_TYPES.INCOMING]: "Entrada",
  [CORRESPONDENCE_TYPES.OUTGOING]: "Salida",
};

// Prioridades
export const PRIORITIES = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: "Baja",
  [PRIORITIES.NORMAL]: "Normal",
  [PRIORITIES.HIGH]: "Alta",
  [PRIORITIES.URGENT]: "Urgente",
};

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: "default",
  [PRIORITIES.NORMAL]: "info",
  [PRIORITIES.HIGH]: "warning",
  [PRIORITIES.URGENT]: "error",
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
    ".tiff",
  ],
  ALLOWED_MIME_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/tiff",
  ],
};

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  CORRESPONDENCE: "/correspondencia",
  CORRESPONDENCE_NEW: "/correspondencia/nueva",
  CORRESPONDENCE_DETAIL: (id: string) => `/correspondencia/${id}`,
  ARCHIVE: "/archivo",
  LOANS: "/prestamos",
  UNAUTHORIZED: "/unauthorized",
} as const;

// Configuración del tema
export const THEME_CONFIG = {
  STORAGE_KEY: "correspondence-theme-config",
  DEFAULT_THEME: "default" as const,
  DEFAULT_MODE: "light" as const,
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 4000,
  ERROR_DURATION: 8000,
  MAX_NOTIFICATIONS: 5,
};

// Roles del sistema
export const USER_ROLES = {
  ADMIN: "admin",
  MESA_ENTRADA: "mesa-entrada",
  RESPONSABLE: "responsable",
  ARCHIVISTA: "archivista",
  CONSULTOR: "consultor",
} as const;

// Recursos para permisos
export const RESOURCES = {
  CORRESPONDENCE: "correspondence",
  FILE_UNIT: "file-unit",
  LOAN: "loan",
  USER: "user",
  AUDIT: "audit",
} as const;

// Acciones para permisos
export const ACTIONS = {
  READ: "read",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  ROUTE: "route",
  CLOSE: "close",
  AUTHORIZE: "authorize",
  MANAGE: "manage",
} as const;

// src/schemas/correspondence.schemas.ts
import { z } from "zod";

// Enums para validación
const CorrespondenceTypeEnum = z.enum(["incoming", "outgoing"]);
const CorrespondenceStatusEnum = z.enum([
  "draft",
  "registered",
  "routed",
  "inProgress",
  "answered",
  "closed",
]);
const PriorityEnum = z.enum(["low", "normal", "high", "urgent"]);
const AccessLevelEnum = z.enum(["public", "restricted", "confidential"]);

// Esquema para crear correspondencia
export const createCorrespondenceSchema = z.object({
  type: CorrespondenceTypeEnum,

  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(200, "El asunto no puede exceder 200 caracteres")
    .trim(),

  description: z
    .string()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .trim()
    .optional(),

  sender: z
    .string()
    .min(1, "El remitente es requerido")
    .max(100, "El remitente no puede exceder 100 caracteres")
    .trim(),

  senderEmail: z
    .string()
    .email("Email inválido")
    .max(100, "El email no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),

  recipientId: z.string().min(1, "El destinatario es requerido"),

  priority: PriorityEnum.default("normal"),

  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((date) => !date || date > new Date(), {
      message: "La fecha límite debe ser posterior a hoy",
    }),

  externalReference: z
    .string()
    .max(50, "La referencia externa no puede exceder 50 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),

  tags: z
    .array(z.string().trim())
    .max(10, "No se pueden agregar más de 10 etiquetas")
    .default([])
    .transform((tags) => tags.filter((tag) => tag.length > 0)),

  isConfidential: z.boolean().default(false),

  accessLevel: AccessLevelEnum.default("public"),

  // Para archivos adjuntos (se validarán en el cliente)
  attachmentCount: z.number().min(0).max(10).default(0),
});

// Esquema para turnar correspondencia
export const routeCorrespondenceSchema = z.object({
  toUserId: z.string().min(1, "El usuario destino es requerido"),

  comments: z
    .string()
    .max(500, "Los comentarios no pueden exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),

  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((date) => !date || date > new Date(), {
      message: "La fecha límite debe ser posterior a hoy",
    }),

  priority: PriorityEnum.optional(),

  isUrgent: z.boolean().default(false),

  requiresConfirmation: z.boolean().default(false),
});

// Esquema para responder correspondencia
export const answerCorrespondenceSchema = z.object({
  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(200, "El asunto no puede exceder 200 caracteres")
    .trim(),

  content: z
    .string()
    .min(1, "El contenido es requerido")
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(5000, "El contenido no puede exceder 5000 caracteres")
    .trim(),

  recipientId: z.string().min(1, "El destinatario es requerido"),

  isConfidential: z.boolean().default(false),

  includeOriginalAttachments: z.boolean().default(false),

  attachmentCount: z.number().min(0).max(10).default(0),
});

// Esquema para cerrar correspondencia
export const closeCorrespondenceSchema = z.object({
  fileUnitId: z.string().min(1, "El expediente es requerido"),

  resolution: z
    .string()
    .min(1, "La resolución es requerida")
    .min(10, "La resolución debe tener al menos 10 caracteres")
    .max(1000, "La resolución no puede exceder 1000 caracteres")
    .trim(),

  tags: z
    .array(z.string().trim())
    .max(10, "No se pueden agregar más de 10 etiquetas")
    .default([])
    .transform((tags) => tags.filter((tag) => tag.length > 0)),
});

// Esquema para filtros de correspondencia
export const correspondenceFiltersSchema = z.object({
  page: z.number().min(1, "La página debe ser mayor a 0").default(1),

  limit: z
    .number()
    .min(1, "El límite debe ser mayor a 0")
    .max(100, "El límite no puede exceder 100")
    .default(20),

  search: z
    .string()
    .trim()
    .optional()
    .transform((val) => val || undefined),

  type: CorrespondenceTypeEnum.optional(),

  status: z
    .array(CorrespondenceStatusEnum)
    .optional()
    .transform((val) => (val?.length ? val : undefined)),

  priority: z
    .array(PriorityEnum)
    .optional()
    .transform((val) => (val?.length ? val : undefined)),

  assigneeId: z
    .string()
    .optional()
    .transform((val) => val || undefined),

  senderId: z
    .string()
    .optional()
    .transform((val) => val || undefined),

  dateFrom: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  dateTo: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  dueDateFrom: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  dueDateTo: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  tags: z
    .array(z.string())
    .optional()
    .transform((val) => (val?.length ? val : undefined)),

  isOverdue: z.boolean().optional(),

  isConfidential: z.boolean().optional(),

  accessLevel: AccessLevelEnum.optional(),

  sortBy: z
    .enum(["createdAt", "dueDate", "priority", "subject", "sender"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Esquema para búsqueda avanzada
export const searchCorrespondenceSchema = z.object({
  query: z
    .string()
    .min(1, "El término de búsqueda es requerido")
    .max(200, "El término no puede exceder 200 caracteres")
    .trim(),

  fields: z
    .array(
      z.enum(["subject", "content", "sender", "tags", "externalReference"])
    )
    .min(1, "Debe seleccionar al menos un campo")
    .default(["subject", "content", "sender"]),

  exactMatch: z.boolean().default(false),

  caseSensitive: z.boolean().default(false),
});

// Esquema para comentarios en movimientos
export const correspondenceCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "El comentario es requerido")
    .max(500, "El comentario no puede exceder 500 caracteres")
    .trim(),

  isInternal: z.boolean().default(false),

  notifyUsers: z
    .array(z.string())
    .max(10, "No se pueden notificar más de 10 usuarios")
    .default([]),
});

// Esquema para etiquetas
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim()
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_]+$/,
      "Solo se permiten letras, números, espacios, guiones y guiones bajos"
    ),

  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "El color debe ser un código hexadecimal válido")
    .optional(),

  description: z
    .string()
    .max(200, "La descripción no puede exceder 200 caracteres")
    .trim()
    .optional(),
});

// Tipos inferidos de los esquemas
export type CreateCorrespondenceFormData = z.infer<
  typeof createCorrespondenceSchema
>;
export type RouteCorrespondenceFormData = z.infer<
  typeof routeCorrespondenceSchema
>;
export type AnswerCorrespondenceFormData = z.infer<
  typeof answerCorrespondenceSchema
>;
export type CloseCorrespondenceFormData = z.infer<
  typeof closeCorrespondenceSchema
>;
export type CorrespondenceFiltersFormData = z.infer<
  typeof correspondenceFiltersSchema
>;
export type SearchCorrespondenceFormData = z.infer<
  typeof searchCorrespondenceSchema
>;
export type CorrespondenceCommentFormData = z.infer<
  typeof correspondenceCommentSchema
>;
export type TagFormData = z.infer<typeof tagSchema>;

// Validaciones personalizadas
export const validateFolioFormat = (folio: string): boolean => {
  // Formato: YYYY-NNNN (ej: 2024-0001)
  return /^\d{4}-\d{4}$/.test(folio);
};

export const validateExternalReference = (reference: string): boolean => {
  // Permitir números, letras, guiones y barras
  return /^[A-Za-z0-9\-/]+$/.test(reference);
};

// Funciones de utilidad para validación
export const isValidCorrespondenceType = (type: string) => {
  return ["incoming", "outgoing"].includes(type);
};

export const isValidPriority = (priority: string) => {
  return ["low", "normal", "high", "urgent"].includes(priority);
};

export const isValidStatus = (status: string) => {
  return [
    "draft",
    "registered",
    "routed",
    "inProgress",
    "answered",
    "closed",
  ].includes(status);
};

// Constantes para validación
export const CORRESPONDENCE_LIMITS = {
  SUBJECT_MAX: 200,
  DESCRIPTION_MAX: 2000,
  CONTENT_MAX: 5000,
  SENDER_MAX: 100,
  TAGS_MAX: 10,
  ATTACHMENTS_MAX: 10,
  COMMENT_MAX: 500,
} as const;

// src/types/correspondence.types.ts
import { BaseEntity, User, FilterBase } from "./common.types";

export type CorrespondenceType = "incoming" | "outgoing";

export type CorrespondenceStatus =
  | "draft"
  | "registered"
  | "routed"
  | "inProgress"
  | "answered"
  | "closed";

export type CorrespondencePriority = "low" | "normal" | "high" | "urgent";

export interface Correspondence extends BaseEntity {
  // Identificación
  folio: string;
  type: CorrespondenceType;
  status: CorrespondenceStatus;
  priority: CorrespondencePriority;

  // Contenido
  subject: string;
  description?: string;
  summary?: string;

  // Participantes
  sender: string;
  senderEmail?: string;
  recipient: User;
  currentAssignee?: User;

  // Fechas
  receivedAt?: Date;
  dueDate?: Date;
  answeredAt?: Date;
  closedAt?: Date;

  // Referencias
  externalReference?: string;
  internalReference?: string;
  parentCorrespondenceId?: string; // Para hilos de respuesta
  fileUnitId?: string; // Expediente asociado

  // Metadatos
  tags: string[];
  attachments: CorrespondenceAttachment[];
  movements: CorrespondenceMovement[];

  // Control
  isConfidential: boolean;
  accessLevel: "public" | "restricted" | "confidential";
}

export interface CorrespondenceAttachment {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  checksum: string;
  uploadedAt: Date;
  uploadedBy: User;
  url?: string;
}

export interface CorrespondenceMovement {
  id: string;
  correspondenceId: string;
  type:
    | "created"
    | "routed"
    | "reassigned"
    | "answered"
    | "closed"
    | "escalated";
  fromUser?: User;
  toUser?: User;
  comments?: string;
  createdAt: Date;
  createdBy: User;
}

export interface CorrespondenceFilters extends FilterBase {
  type?: CorrespondenceType;
  status?: CorrespondenceStatus[];
  priority?: CorrespondencePriority[];
  assigneeId?: string;
  senderId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  tags?: string[];
  isOverdue?: boolean;
  isConfidential?: boolean;
}

export interface CreateCorrespondenceDto {
  type: CorrespondenceType;
  subject: string;
  description?: string;
  sender: string;
  senderEmail?: string;
  recipientId: string;
  priority: CorrespondencePriority;
  dueDate?: Date;
  externalReference?: string;
  tags: string[];
  attachments?: File[];
  isConfidential: boolean;
  accessLevel: "public" | "restricted" | "confidential";
}

export interface RouteCorrespondenceDto {
  toUserId: string;
  comments?: string;
  dueDate?: Date;
  priority?: CorrespondencePriority;
}

export interface AnswerCorrespondenceDto {
  subject: string;
  content: string;
  recipientId: string;
  attachments?: File[];
  isConfidential?: boolean;
}

// src/schemas/correspondence.schemas.ts
import { z } from "zod";

export const createCorrespondenceSchema = z.object({
  type: z.enum(["incoming", "outgoing"], {
    required_error: "El tipo es requerido",
  }),

  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(200, "El asunto no puede exceder 200 caracteres"),

  description: z
    .string()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional(),

  sender: z
    .string()
    .min(1, "El remitente es requerido")
    .max(100, "El remitente no puede exceder 100 caracteres"),

  senderEmail: z.string().email("Email inválido").optional(),

  recipientId: z.string().min(1, "El destinatario es requerido"),

  priority: z.enum(["low", "normal", "high", "urgent"], {
    required_error: "La prioridad es requerida",
  }),

  dueDate: z
    .string()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),

  externalReference: z
    .string()
    .max(50, "La referencia externa no puede exceder 50 caracteres")
    .optional(),

  tags: z
    .array(z.string())
    .max(10, "No se pueden agregar más de 10 etiquetas")
    .default([]),

  isConfidential: z.boolean().default(false),

  accessLevel: z
    .enum(["public", "restricted", "confidential"])
    .default("public"),
});

export const routeCorrespondenceSchema = z.object({
  toUserId: z.string().min(1, "El usuario destino es requerido"),

  comments: z
    .string()
    .max(500, "Los comentarios no pueden exceder 500 caracteres")
    .optional(),

  dueDate: z
    .string()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),

  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
});

export const answerCorrespondenceSchema = z.object({
  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(200, "El asunto no puede exceder 200 caracteres"),

  content: z
    .string()
    .min(1, "El contenido es requerido")
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(5000, "El contenido no puede exceder 5000 caracteres"),

  recipientId: z.string().min(1, "El destinatario es requerido"),

  isConfidential: z.boolean().default(false),
});

export const correspondenceFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  type: z.enum(["incoming", "outgoing"]).optional(),
  status: z
    .array(
      z.enum([
        "draft",
        "registered",
        "routed",
        "inProgress",
        "answered",
        "closed",
      ])
    )
    .optional(),
  priority: z.array(z.enum(["low", "normal", "high", "urgent"])).optional(),
  assigneeId: z.string().optional(),
  dateFrom: z
    .string()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),
  dateTo: z
    .string()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : undefined))
    .optional(),
  isOverdue: z.boolean().optional(),
  isConfidential: z.boolean().optional(),
});

export type CreateCorrespondenceFormData = z.infer<
  typeof createCorrespondenceSchema
>;
export type RouteCorrespondenceFormData = z.infer<
  typeof routeCorrespondenceSchema
>;
export type AnswerCorrespondenceFormData = z.infer<
  typeof answerCorrespondenceSchema
>;
export type CorrespondenceFiltersFormData = z.infer<
  typeof correspondenceFiltersSchema
>;

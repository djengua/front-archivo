
# 🧭 Mapa de Casos de Uso — Correspondencia, Archivo y Préstamos (Hexagonal)

Este mapa enlaza los procesos documentados con **casos de uso (puertos de entrada)**, sus **puertos de salida**, estados, eventos de dominio, reglas e interfaces REST/GraphQL. Sirve como blueprint para implementar el backend en Node (TS) y un frontend en Next.js.

---

## 0) Contexto DDD / Capas

**Agregados clave**
- `Correspondence` (Oficio/Comunicación) — raíz: `correspondenceId`
- `FileUnit` (Expediente) — raíz: `fileUnitId`
- `Record` (Documento) — raíz: `recordId` (ligado a `FileUnit`)
- `Loan` (Préstamo) — raíz: `loanId`
- `Series`, `RetentionRule`, `User/Role/Permission`, `AuditEntry`, `DigitalObject`

**Estados (máquinas de estado)**
- **Correspondence**: `Draft → Registered → Routed → InProgress → Answered → Closed`
- **FileUnit**: `Open → Closing → Closed → Transferred(Concentration) → Historical`
- **Loan**: `Requested → Authorized → Delivered → Extended → Returned → Overdue`

---

## 1) Módulo de Correspondencia

### CU-01 Registrar correspondencia de entrada
- **Actor**: Mesa de entrada / Sistema de ingestión.
- **Objetivo**: Capturar pieza externa, asignar folio y destinatario inicial.
- **Precondiciones**: Documento disponible (físico/digital).
- **Reglas**: Folio único por año; datos mínimos (remitente, asunto, fecha).
- **Salida**: `correspondenceId`, `folioEntrada`.
- **Eventos**: `CorrespondenceRegistered`
- **Errores**: Duplicado por hash/folio, destinatario inexistente.
- **Puertos**
  - **In**: `RegisterIncomingCorrespondencePort`
  - **Out**: `CorrespondenceRepository`, `IdGenerator`, `Clock`, `SearchIndex`, `FileStorage`(opcional), `OcrService`(opcional)
- **REST**: `POST /correspondence/incoming`
- **GraphQL**: `mutation registerIncomingCorrespondence(input)`

### CU-02 Crear oficio interno (salida)
- **Actor**: Usuario emisor.
- **Objetivo**: Redactar y registrar oficio con folio de salida.
- **Reglas**: Folio de salida consecutivo; plantillas por tipología.
- **Eventos**: `OutgoingCorrespondenceCreated`
- **Puertos**: In `CreateOutgoingCorrespondencePort` / Out `CorrespondenceRepository`, `SearchIndex`
- **REST**: `POST /correspondence/outgoing`
- **GraphQL**: `mutation createOutgoingCorrespondence(input)`

### CU-03 Turnar / asignar correspondencia
- **Actor**: Mesa de entrada / Responsable.
- **Objetivo**: Enviar a usuario/área responsable, registrar turno.
- **Reglas**: Mantener trazabilidad; permisos del asignador.
- **Eventos**: `CorrespondenceRouted`
- **Puertos**: In `RouteCorrespondencePort` / Out `CorrespondenceRepository`, `EventBus`, `NotificationService`
- **REST**: `POST /correspondence/:id/route`
- **GraphQL**: `mutation routeCorrespondence(id, input)`

### CU-04 Responder correspondencia
- **Actor**: Responsable.
- **Objetivo**: Generar respuesta ligada (hilo), con folio de salida.
- **Reglas**: Respuesta hereda controles de confidencialidad; referencia al original.
- **Eventos**: `CorrespondenceAnswered`
- **Puertos**: In `AnswerCorrespondencePort` / Out `CorrespondenceRepository`, `SearchIndex`
- **REST**: `POST /correspondence/:id/answer`
- **GraphQL**: `mutation answerCorrespondence(id, input)`

### CU-05 Reasignar / Escalar
- **Actor**: Responsable / Supervisor.
- **Objetivo**: Cambiar responsable o elevar prioridad.
- **Eventos**: `CorrespondenceReassigned`, `CorrespondenceEscalated`
- **Puertos**: In `ReassignCorrespondencePort` / Out `CorrespondenceRepository`, `NotificationService`
- **REST**: `POST /correspondence/:id/reassign`
- **GraphQL**: `mutation reassignCorrespondence(id, input)`

### CU-06 Cerrar correspondencia
- **Actor**: Responsable.
- **Objetivo**: Marcar atendida, ligar a expediente.
- **Reglas**: No cerrar si hay acciones pendientes; expediente requerido.
- **Eventos**: `CorrespondenceClosed`
- **Puertos**: In `CloseCorrespondencePort` / Out `CorrespondenceRepository`, `FileUnitRepository`
- **REST**: `POST /correspondence/:id/close`
- **GraphQL**: `mutation closeCorrespondence(id, fileUnitId)`

---

## 2) Módulo de Archivo (Gestión → Concentración → Histórico)

### CU-07 Crear expediente (FileUnit)
- **Actor**: Gestor documental / Sistema.
- **Objetivo**: Abrir expediente dentro de una `Series`.
- **Eventos**: `FileUnitOpened`
- **Puertos**: In `OpenFileUnitPort` / Out `FileUnitRepository`
- **REST**: `POST /file-units`
- **GraphQL**: `mutation openFileUnit(input)`

### CU-08 Ingresar documento (Record) al expediente
- **Actor**: Usuario / Proceso de ingestión.
- **Objetivo**: Registrar metadatos + binario (objeto digital).
- **Reglas**: Fixity (SHA-256), antivirus, OCR (opcional).
- **Eventos**: `RecordIngested`, `DigitalObjectAttached`, `PreservationEventLogged`
- **Puertos**: In `IngestRecordPort` / Out `MetadataRepository`, `FileStorage`, `OcrService`, `Antivirus`, `SearchIndex`, `EventBus`
- **REST**: `POST /file-units/:id/records`
- **GraphQL**: `mutation ingestRecord(input)`

### CU-09 Describir / actualizar metadatos
- **Actor**: Catalogador.
- **Objetivo**: Aplicar plantilla y validaciones.
- **Eventos**: `RecordDescribed`
- **Puertos**: In `DescribeRecordPort` / Out `MetadataRepository`, `SearchIndex`
- **REST**: `PATCH /records/:id/describe`
- **GraphQL**: `mutation describeRecord(id, input)`

### CU-10 Cerrar expediente
- **Actor**: Responsable de área.
- **Reglas**: Sin pendientes abiertos; registrar `closedAt`.
- **Eventos**: `FileUnitClosed`
- **Puertos**: In `CloseFileUnitPort` / Out `FileUnitRepository`
- **REST**: `POST /file-units/:id/close`
- **GraphQL**: `mutation closeFileUnit(id)`

### CU-11 Transferencia primaria (Gestión → Concentración)
- **Actor**: Archivo de gestión/concentración.
- **Objetivo**: Mover expedientes cerrados según CDD.
- **Eventos**: `FileUnitTransferredToConcentration`
- **Puertos**: In `TransferToConcentrationPort` / Out `FileUnitRepository`, `PreservationLogRepository`
- **REST**: `POST /file-units/:id/transfer/concentration`
- **GraphQL**: `mutation transferToConcentration(id)`

### CU-12 Evaluación y disposición (Eliminar/Conservar/Extender)
- **Actor**: Comité de valoración documental.
- **Objetivo**: Aplicar `RetentionRule`.
- **Eventos**: `DispositionScheduled`, `DispositionExecuted`
- **Puertos**: In `ScheduleDispositionPort`, `ExecuteDispositionPort` / Out `MetadataRepository`, `EventBus`, `AuditRepository`
- **REST**: `POST /dispositions/schedule` / `POST /dispositions/:id/execute`
- **GraphQL**: `mutation scheduleDisposition(input)` / `mutation executeDisposition(id)`

### CU-13 Transferencia secundaria (Concentración → Histórico)
- **Actor**: Archivo histórico.
- **Objetivo**: Ingresar expedientes de valor permanente.
- **Eventos**: `FileUnitTransferredToHistorical`
- **Puertos**: In `TransferToHistoricalPort` / Out `FileUnitRepository`, `PreservationLogRepository`
- **REST**: `POST /file-units/:id/transfer/historical`
- **GraphQL**: `mutation transferToHistorical(id)`

---

## 3) Módulo de Préstamos

### CU-14 Solicitar préstamo
- **Actor**: Usuario solicitante.
- **Reglas**: ACL/Confidencialidad; disponibilidad.
- **Eventos**: `LoanRequested`
- **Puertos**: In `RequestLoanPort` / Out `LoanRepository`, `NotificationService`
- **REST**: `POST /loans`
- **GraphQL**: `mutation requestLoan(input)`

### CU-15 Autorizar préstamo
- **Actor**: Responsable de archivo.
- **Reglas**: Permisos, restricciones de serie/estado.
- **Eventos**: `LoanAuthorized`
- **Puertos**: In `AuthorizeLoanPort` / Out `LoanRepository`, `AuditRepository`
- **REST**: `POST /loans/:id/authorize`
- **GraphQL**: `mutation authorizeLoan(id)`

### CU-16 Entregar y controlar préstamo
- **Actor**: Archivo.
- **Eventos**: `LoanDelivered`, `LoanExtended`, `LoanMarkedOverdue`
- **Puertos**: In `DeliverLoanPort`, `ExtendLoanPort`, `MarkOverdueLoanPort` / Out `LoanRepository`, `NotificationService`, `Clock`
- **REST**: `POST /loans/:id/deliver`, `POST /loans/:id/extend`, `POST /loans/:id/mark-overdue`
- **GraphQL**: `mutation deliverLoan(id)`, `mutation extendLoan(id, days)`, `mutation markLoanOverdue(id)`

### CU-17 Registrar devolución
- **Actor**: Usuario/Archivo.
- **Reglas**: Verificación de integridad; cierres pendientes.
- **Eventos**: `LoanReturned`
- **Puertos**: In `ReturnLoanPort` / Out `LoanRepository`, `AuditRepository`
- **REST**: `POST /loans/:id/return`
- **GraphQL**: `mutation returnLoan(id)`

---

## 4) Búsqueda, Seguridad y Auditoría (Transversales)

### CU-18 Búsqueda facetada y full-text
- **Actor**: Cualquier usuario con permisos.
- **Puertos**: In `SearchRecordsPort` / Out `SearchIndex`
- **REST**: `GET /search?q=&series=&from=&to=&state=&acl=`
- **GraphQL**: `query searchRecords(filters)`

### CU-19 Autenticación y autorización (RBAC)
- **Actor**: Sistema.
- **Puertos**: In `AuthenticatePort`, `AuthorizePort` / Out `UserRepository`, `TokenService`
- **REST**: `POST /auth/login`, `GET /me`
- **GraphQL**: `mutation login`, `query me`

### CU-20 Auditoría y trazabilidad
- **Actor**: Auditor/Supervisor.
- **Puertos**: In `ReadAuditLogPort` / Out `AuditRepository`
- **REST**: `GET /audit?targetType=&targetId=&from=&to=`
- **GraphQL**: `query auditLog(filters)`

---

## 5) Diagramas (Mermaid)

### 5.1 Flujo de correspondencia (simplificado)
```mermaid
flowchart LR
  A[Registrar Entrada] --> B[Route/Turnar]
  B --> C[En Trámite]
  C -->|Responder| D[Respuesta (Salida)]
  C -->|Reasignar| B
  C -->|Cerrar| E[Cerrar y Vincular a Expediente]
````

### 5.2 Estados de préstamo

```mermaid
stateDiagram-v2
  [*] --> Requested
  Requested --> Authorized
  Authorized --> Delivered
  Delivered --> Extended
  Delivered --> Returned
  Delivered --> Overdue
  Extended --> Returned
  Overdue --> Returned
  Returned --> [*]
```

---

## 6) Eventos de dominio (nombres y payload mínimo)

* `CorrespondenceRegistered { id, folio, recipientId, at }`
* `OutgoingCorrespondenceCreated { id, folio, senderId, at }`
* `CorrespondenceRouted { id, fromUserId, toUserId, at }`
* `CorrespondenceAnswered { id, replyId, at }`
* `CorrespondenceClosed { id, fileUnitId, at }`
* `FileUnitOpened { id, seriesId, at }`
* `RecordIngested { recordId, fileUnitId, checksum, at }`
* `DigitalObjectAttached { digitalObjectId, recordId, at }`
* `RecordDescribed { recordId, changes, at }`
* `FileUnitClosed { id, at }`
* `FileUnitTransferredToConcentration { id, at }`
* `DispositionScheduled { id, fileUnitId, action, dueAt }`
* `DispositionExecuted { id, result, at }`
* `FileUnitTransferredToHistorical { id, at }`
* `LoanRequested { loanId, fileUnitId|recordId, requesterId, at }`
* `LoanAuthorized { loanId, approverId, at }`
* `LoanDelivered { loanId, dueAt, at }`
* `LoanExtended { loanId, newDueAt, at }`
* `LoanMarkedOverdue { loanId, at }`
* `LoanReturned { loanId, at }`

---

## 7) Reglas e Invariantes (ejemplos)

* **Correspondence**

  * No `Close` si `pendingActions > 0`.
  * Toda `Answer` crea un nuevo folio de salida y referencia al original.
* **FileUnit**

  * `Close` requiere todos los `Record` en estado `current|closed`.
  * Transferencias sólo con `status = Closed`.
* **Loan**

  * `Authorize` requiere permiso y disponibilidad.
  * `Deliver` fija `dueAt` ≥ `now + minLoanDays`.
  * `Return` desbloquea el recurso para futuras solicitudes.

---

## 8) Métricas/KPIs

* Tiempo medio de respuesta por área.
* Correspondencia vencida (SLA).
* Tasa de re-asignaciones.
* Porcentaje de expedientes cerrados por mes.
* Falsos duplicados / reingestas bloqueadas por checksum.
* Préstamos vencidos vs. devueltos a tiempo.

---

## 9) Seguridad y Cumplimiento

* **RBAC** por `Series`, `FileUnit`, `Correspondence`.
* **PII/Confidencialidad**: redacción de derivados para acceso público.
* **Auditoría**: todos los CU registran `AuditEntry`.
* **Fixity**: SHA-256 al ingresar y en verificaciones programadas.

---

## 10) Backlog sugerido (MVP → Fase 2)

**MVP**

1. CU-01, CU-02, CU-03, CU-04, CU-06 (ciclo básico de correspondencia)
2. CU-07, CU-08, CU-10, CU-18 (archivo y búsqueda)
3. CU-14, CU-15, CU-17 (préstamos básico)
4. CU-19, CU-20 (auth y auditoría)

**Fase 2**

* CU-05 (escalamiento), CU-11/12/13 (transferencias y disposición), OCR/antivirus, notificaciones y paneles.


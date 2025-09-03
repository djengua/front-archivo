# 🚀 Roadmap Frontend - Sistema de Correspondencia y Archivo

## 📋 Fase 1: Configuración Base y Login

### 1.1 Setup del Proyecto
```bash
# Crear proyecto Next.js
npx create-next-app@latest correspondencia-app --typescript --tailwind --eslint --app

# Instalar dependencias principales
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install zustand jwt-decode axios react-hook-form @hookform/resolvers yup
npm install date-fns lucide-react

# Dependencias de desarrollo
npm install @types/node @types/react @types/react-dom
```

### 1.2 Configuración de Material UI
- [ ] Configurar tema personalizado (`theme/index.ts`)
- [ ] Setup de ThemeProvider en layout principal
- [ ] Configurar fuentes y colores corporativos
- [ ] Crear componentes base reutilizables

### 1.3 Estructura de Carpetas
```
src/
├── app/                    # App router de Next.js
│   ├── (auth)/            # Grupo de rutas de autenticación
│   │   └── login/
│   ├── (dashboard)/       # Grupo de rutas protegidas
│   │   ├── correspondencia/
│   │   ├── archivo/
│   │   └── prestamos/
│   └── layout.tsx
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base UI
│   ├── forms/            # Formularios específicos
│   └── layout/           # Componentes de layout
├── stores/               # Estados globales con Zustand
│   ├── authStore.ts
│   ├── correspondenceStore.ts
│   └── fileUnitStore.ts
├── services/             # Servicios API
│   ├── api.ts           # Configuración axios
│   ├── auth.ts
│   └── correspondence.ts
├── types/                # Tipos TypeScript
├── utils/               # Utilidades
└── theme/               # Configuración Material UI
```

### 1.4 Sistema de Autenticación
- [ ] Store de autenticación con Zustand
- [ ] Servicio de API para login/logout
- [ ] Middleware para protección de rutas
- [ ] Manejo de tokens JWT
- [ ] Hook personalizado `useAuth`

## 📨 Fase 2: Módulo de Correspondencia - MVP

### 2.1 Estados y Tipos Base
```typescript
// Definir tipos según el documento DDD
interface Correspondence {
  id: string;
  folio: string;
  type: 'incoming' | 'outgoing';
  status: 'draft' | 'registered' | 'routed' | 'inProgress' | 'answered' | 'closed';
  subject: string;
  sender: string;
  recipient: string;
  createdAt: Date;
  dueDate?: Date;
  // ... más campos
}
```

### 2.2 Store de Correspondencia (Zustand)
- [ ] Estado global para correspondencias
- [ ] Acciones CRUD básicas
- [ ] Filtros y búsqueda
- [ ] Paginación
- [ ] Estados de carga y error

### 2.3 Servicios API
- [ ] `POST /correspondence/incoming` (CU-01)
- [ ] `POST /correspondence/outgoing` (CU-02)
- [ ] `POST /correspondence/:id/route` (CU-03)
- [ ] `POST /correspondence/:id/answer` (CU-04)
- [ ] `POST /correspondence/:id/close` (CU-06)
- [ ] `GET /correspondence` con filtros

### 2.4 Componentes de Correspondencia

#### Dashboard Principal
- [ ] Tarjetas de resumen (pendientes, vencidas, etc.)
- [ ] Gráfico de estados de correspondencia
- [ ] Lista de tareas pendientes

#### Lista de Correspondencias
- [ ] Tabla con filtros avanzados
- [ ] Búsqueda por folio, asunto, remitente
- [ ] Paginación y ordenamiento
- [ ] Acciones por fila (ver, editar, turnar)

#### Formularios
- [ ] **Registrar Correspondencia Entrante**
  - Campo folio (auto-generado)
  - Remitente, asunto, fecha
  - Upload de archivos
  - Asignación inicial
- [ ] **Crear Oficio Saliente**
  - Plantillas predefinidas
  - Editor de texto enriquecido
  - Destinatarios múltiples
- [ ] **Turnar/Asignar**
  - Selector de usuarios/áreas
  - Comentarios opcionales
  - Fecha límite

#### Vistas Detalle
- [ ] Vista de correspondencia individual
- [ ] Historial de movimientos
- [ ] Documentos adjuntos
- [ ] Timeline de respuestas

### 2.5 Navegación y Layout
- [ ] Sidebar con menú principal
- [ ] Breadcrumbs dinámicos
- [ ] Header con perfil de usuario
- [ ] Notificaciones en tiempo real

## 🗂️ Fase 3: Módulo de Archivo (Básico)

### 3.1 Gestión de Expedientes
- [ ] Lista de expedientes (FileUnits)
- [ ] Crear nuevo expediente
- [ ] Estados del expediente
- [ ] Vinculación con correspondencia

### 3.2 Gestión de Documentos
- [ ] Upload de documentos al expediente
- [ ] Metadatos básicos
- [ ] Previsualización de archivos
- [ ] Control de versiones

## 🔍 Fase 4: Búsqueda y Filtros Avanzados

### 4.1 Búsqueda Global
- [ ] Buscador full-text
- [ ] Filtros por tipo, estado, fecha
- [ ] Resultados con highlighting
- [ ] Búsqueda guardada

### 4.2 Reportes Básicos
- [ ] Dashboard con KPIs
- [ ] Exportación a Excel/PDF
- [ ] Gráficos con recharts o material-ui charts

## 🛠️ Componentes Técnicos Transversales

### Manejo de Estado
```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// correspondenceStore.ts
interface CorrespondenceState {
  items: Correspondence[];
  selectedItem: Correspondence | null;
  filters: CorrespondenceFilters;
  loading: boolean;
  error: string | null;
  // Actions
  fetchCorrespondences: () => Promise<void>;
  createCorrespondence: (data: CreateCorrespondenceDto) => Promise<void>;
  routeCorrespondence: (id: string, data: RouteDto) => Promise<void>;
}
```

### Servicios API
```typescript
// api.ts - Configuración base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Hooks Personalizados
- [ ] `useAuth()` - Manejo de autenticación
- [ ] `useCorrespondence()` - CRUD de correspondencias
- [ ] `useDebounce()` - Para búsquedas
- [ ] `useLocalStorage()` - Persistencia local

### Componentes UI Reutilizables
- [ ] `<DataTable />` - Tabla con paginación y filtros
- [ ] `<SearchBox />` - Búsqueda con autocomplete
- [ ] `<FileUpload />` - Upload con drag & drop
- [ ] `<StatusChip />` - Chips de estado
- [ ] `<DateRangePicker />` - Selector de fechas
- [ ] `<UserSelector />` - Selector de usuarios/áreas

## 📱 Consideraciones de UX/UI

### Responsive Design
- [ ] Mobile-first approach
- [ ] Breakpoints para tablet y desktop
- [ ] Menú hamburguesa en mobile

### Accesibilidad
- [ ] Navegación por teclado
- [ ] ARIA labels
- [ ] Contraste de colores
- [ ] Screen reader friendly

### Performance
- [ ] Lazy loading de componentes
- [ ] Virtualización de listas largas
- [ ] Caché de datos con react-query (opcional)
- [ ] Optimización de imágenes

## 🚦 Cronograma Sugerido (8-12 semanas)

### Semana 1-2: Setup y Login
- Configuración del proyecto
- Sistema de autenticación completo
- Layout básico y navegación

### Semana 3-4: Correspondencia Core
- CRUD de correspondencias
- Formularios principales
- Lista con filtros básicos

### Semana 5-6: Flujos de Trabajo
- Turnar correspondencia
- Responder oficios
- Estados y transiciones

### Semana 7-8: Archivo Básico
- Expedientes y documentos
- Vinculación correspondencia-expediente
- Upload de archivos

### Semana 9-10: Búsqueda y Reportes
- Búsqueda avanzada
- Dashboard con métricas
- Exportaciones

### Semana 11-12: Pulido y Testing
- Testing e2e
- Optimizaciones de performance
- Documentación

## 🎯 MVP Mínimo Viable

Para empezar rápido, el MVP incluiría:

1. ✅ **Login/Logout funcional**
2. ✅ **Registrar correspondencia entrante**
3. ✅ **Lista de correspondencias con filtros básicos**
4. ✅ **Turnar correspondencia**
5. ✅ **Vista de detalle**
6. ✅ **Estados básicos del flujo**

¿Te parece bien este enfoque? ¿Quieres que empecemos con algún paso específico?
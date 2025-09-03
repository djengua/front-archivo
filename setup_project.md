# 1. Crear proyecto Next.js con TypeScript
npx create-next-app@latest correspondencia-app --typescript --tailwind --eslint --app --src-dir

# 2. Navegar al directorio
cd correspondencia-app

# 3. Instalar dependencias principales
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers

# 4. Instalar para manejo de estado y formularios
npm install zustand jwt-decode axios react-hook-form @hookform/resolvers zod

# 5. Instalar utilidades
npm install date-fns lucide-react clsx

# 6. Instalar tipos de desarrollo
npm install -D @types/node @types/react @types/react-dom

npm run dev

# Estructura del proyecto

src/
├── app/                          # App Router Next.js
│   ├── (auth)/                  # Rutas de autenticación (no protegidas)
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/             # Rutas protegidas del dashboard
│   │   ├── correspondencia/
│   │   │   ├── nueva/
│   │   │   │   └── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── archivo/
│   │   │   └── page.tsx
│   │   ├── prestamos/
│   │   │   └── page.tsx
│   │   └── layout.tsx           # Layout para rutas protegidas
│   ├── globals.css
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Página inicial (redirect)
├── components/                  # Componentes reutilizables
│   ├── ui/                     # Componentes base de UI
│   │   ├── DataTable.tsx
│   │   ├── SearchBox.tsx
│   │   ├── FileUpload.tsx
│   │   ├── StatusChip.tsx
│   │   └── LoadingSpinner.tsx
│   ├── forms/                  # Formularios específicos
│   │   ├── LoginForm.tsx
│   │   ├── CorrespondenceForm.tsx
│   │   └── RouteForm.tsx
│   ├── layout/                 # Componentes de layout
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── ProtectedRoute.tsx
│   └── correspondence/         # Componentes específicos de correspondencia
│       ├── CorrespondenceList.tsx
│       ├── CorrespondenceCard.tsx
│       └── CorrespondenceDetail.tsx
├── stores/                     # Estados globales con Zustand
│   ├── authStore.ts
│   ├── correspondenceStore.ts
│   ├── uiStore.ts
│   └── index.ts
├── services/                   # Servicios y APIs
│   ├── api.ts                 # Configuración axios
│   ├── auth.service.ts
│   ├── correspondence.service.ts
│   └── mock/                  # Datos mock
│       ├── correspondence.mock.ts
│       ├── users.mock.ts
│       └── index.ts
├── types/                     # Tipos TypeScript
│   ├── auth.types.ts
│   ├── correspondence.types.ts
│   ├── common.types.ts
│   └── index.ts
├── utils/                     # Utilidades y helpers
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── hooks/                     # Hooks personalizados
│   ├── useAuth.ts
│   ├── useCorrespondence.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── theme/                     # Configuración Material UI
│   ├── index.ts
│   ├── palette.ts
│   ├── typography.ts
│   └── components.ts
└── schemas/                   # Esquemas Zod para validación
    ├── auth.schemas.ts
    ├── correspondence.schemas.ts
    └── index.ts
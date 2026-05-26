# Codebase Structure

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The directories and physical files listed below reflect the monorepo layout detailed in `dev_docs/prd.md` to be initialized during development.

## Directory Layout

```
inquisitive/
├── apps/
│   ├── web/                    # React Web Application (Vite)
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI elements (cards, loaders, boards)
│   │   │   ├── pages/          # Full route layouts (Workspace, Dashboard, Home)
│   │   │   ├── hooks/          # Custom hooks (Query, Mutations, optimistic actions)
│   │   │   ├── stores/         # Zustand global state (Kanban board UI states)
│   │   │   ├── lib/            # API client configurations (axios/fetch setups)
│   │   │   ├── types/          # Frontend-specific type overrides
│   │   │   ├── App.tsx         # Central application routing component
│   │   │   ├── index.css       # Style sheets (Tailwind imports and tokens)
│   │   │   └── main.tsx        # React client-side DOM compiler entry
│   │   ├── package.json        # Frontend manifest & dependencies
│   │   └── vite.config.ts      # Vite compilation configurations
│   └── api/                    # Hono.js Backend Application
│       ├── src/
│       │   ├── db/             # Drizzle schemas, migration files, and DB clients
│       │   ├── middleware/     # Header interceptors and error handlers
│       │   ├── routes/         # Hono request endpoints (notebooks, resources)
│       │   ├── services/       # Core external system managers (Groq, Tavily)
│       │   ├── types/          # Zod schema declarations and API types
│       │   └── index.ts        # Hono server bootstrapper and core listener
│       └── package.json        # Backend manifest & dependencies
├── dev_docs/
│   └── prd.md                  # Phase 1 Product Requirements Document
├── .planning/                  # Get-Shit-Done (GSD) local state & maps
│   └── codebase/               # Codebase analysis documents
├── package.json                # Monorepo root package configuration
└── README.md                   # Primary system startup documentation
```

---

## Directory Purposes

**apps/web/**
- **Purpose:** Browser interface client workspace, constructed using React 18, Vite, TypeScript, Zustand, and Tailwind CSS.
- **Contains:** Component libraries, styles, and custom hooks designed to connect to the backend.
- **Key files:** 
  - `src/main.tsx` - App client bootstrapper.
  - `src/index.css` - Custom styling tokens and Tailwind mappings.

**apps/api/**
- **Purpose:** Server API built using Hono.js, Drizzle ORM, Zod, and Neon Postgres, handling AI planning and resources.
- **Contains:** Routes, middleware validators, and external connector services.
- **Key files:** 
  - `src/index.ts` - Hono route mapper and listener.
  - `src/db/schema.ts` - Drizzle Database Schema definition.

**dev_docs/**
- **Purpose:** Hold product specifications, designs, and architectural templates.
- **Key files:** 
  - `prd.md` - Phase 1 detailed functional requirements document.

---

## Key File Locations

**Entry Points:**
- `apps/web/src/main.tsx` - Client DOM bootstrap entry.
- `apps/api/src/index.ts` - Hono API web listener entry.

**Configuration:**
- `package.json` - Monorepo root definition.
- `apps/web/vite.config.ts` - Frontend bundle configuration.
- `apps/web/tailwind.config.js` - Styling engine setup.

**Core Logic:**
- `apps/api/src/services/planner.ts` - Topic builder using Groq.
- `apps/api/src/services/enricher.ts` - Web lookup using Tavily.
- `apps/api/src/db/schema.ts` - Postgres table setups.

---

## Naming Conventions

**Files:**
- `PascalCase.tsx` - Used for React UI components (e.g., `KanbanBoard.tsx`).
- `kebab-case.ts` - Used for services, hooks, utilities, and routes (e.g., `device-id.ts`, `use-notebook.ts`).
- `*.test.ts` - Test suites placed directly alongside their corresponding source files.

**Directories:**
- `kebab-case` - Feature and layout directories (e.g., `src/components/ui/`, `apps/api/src/`).
- Plural names for group directories (`routes`, `services`, `hooks`, `stores`).

---

## Where to Add New Code

**New Feature (Kanban interaction update):**
- UI View: `apps/web/src/components/`
- Client State Hooks: `apps/web/src/hooks/`
- API Sync Router: `apps/api/src/routes/`

**New Model Element (Database updates):**
- Table Schema: `apps/api/src/db/schema.ts`
- Zod Request Check: `apps/api/src/types/`

---

*Structure analysis: 2026-05-26*
*Update when directory structure changes*

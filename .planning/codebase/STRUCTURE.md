# Codebase Structure

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The directories and physical files listed below reflect the newly restructured monorepo layout.
>
> In accordance with user specifications, this structure contains purely architectural bootstrapping setups (Neon, Drizzle, Dotenv, Tailwind CSS, and Morgan logging) without containing any application domain schema or core business logic.

## Directory Layout

```
inquisitive/
├── backend/                  # express.js API service
│   ├── logs/                # Local log storage directory
│   │   ├── error.log        # Persistent error-only logs stream
│   │   └── logs.log         # General unified execution logs stream
│   ├── src/
│   │   ├── config/          # Configurations (Neon DB client, env loaders)
│   │   ├── constants/       # App-wide status codes & constants
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Morgan logger and Custom Express middlewares
│   │   ├── models/          # Drizzle Schemas & ORM tables
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Core business operations
│   │   ├── utils/           # Helper utility modules (e.g. colorized logger)
│   │   ├── app.ts           # App setup, CORS configuration, & Morgan linkage
│   │   └── server.ts        # Server entry listener using colorized logs
│   ├── .env                 # Local API configurations
│   ├── .gitignore           # Git exclusions
│   ├── package.json         # Backend dependencies & script maps
│   └── README.md            # Backend instructions
├── frontend/                 # React Web SPA (Vite)
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── assets/          # Static elements (fonts, icons, SVG/images)
│   │   ├── components/      # Reusable atomic UI elements (Buttons, Inputs)
│   │   ├── config/          # Client environment keys & clients
│   │   ├── context/         # React state context providers
│   │   ├── features/        # THE CORE: Domain-driven modules
│   │   │   ├── auth/        # Feature auth placeholder
│   │   │   └── dashboard/   # Feature dashboard placeholder
│   │   ├── hooks/           # Global custom hooks
│   │   ├── layouts/         # Frame wrappers (RootLayout, AuthLayout)
│   │   ├── routes/          # Navigation rules & routing endpoints
│   │   ├── services/        # Analytics, logs, and telemetry connectors
│   │   ├── store/           # Zustand global state definitions
│   │   ├── styles/          # Tailwind styling (global.css)
│   │   ├── types/           # Global type mappings
│   │   ├── utils/           # Shared client formatters and checkers
│   │   ├── app.tsx          # Client app wrapper with Welcome view
│   │   └── main.tsx         # Virtual DOM renderer mount point
│   ├── .env                 # Client key storage
│   ├── .gitignore           # Git exclusions
│   ├── package.json         # Client package dependencies
│   ├── postcss.config.js    # PostCSS rules
│   ├── tailwind.config.js   # Tailwind Content mappings
│   └── README.md            # Client handbook
├── shared/                   # Shared workspaces (Libraries)
│   ├── config-eslint/       # ESLint ruleset package
│   │   ├── index.js         # Unified ESLint settings
│   │   └── package.json
│   ├── config-typescript/   # TS compiler configs
│   │   ├── tsconfig.base.json # Global compiler configs
│   │   └── package.json
│   ├── types/               # Type declarations library
│   │   ├── src/
│   │   │   ├── api-responses.ts # Shared API contract types
│   │   │   └── models.ts    # Common database models
│   │   └── package.json
│   └── ui/                  # Atomic components design system
│       ├── src/             # Component blueprints
│       └── package.json
├── package.json              # Monorepo workspaces coordinator
├── tsconfig.base.json        # Base tsconfig base
└── README.md                 # Primary workspace guidelines
```

---

## Directory Purposes

**backend/**
- **Purpose:** Rest API server using Node.js and Express. It organizes operations in a model-controller-service pattern.
- **Key files:**
  - `src/app.ts` - Creates Express instance and binds Morgan logging, body parsing, and CORS.
  - `src/server.ts` - Starts the port listener.
  - `src/config/db.ts` - Initialized for Neon PostgreSQL serverless using Drizzle ORM.

**frontend/**
- **Purpose:** User interface single page app built using React 18, Vite, React Router, Zustand, and Tailwind CSS.
- **Key files:**
  - `tailwind.config.js` & `postcss.config.js` - Dynamic class styling parameters.
  - `src/app.tsx` - Initialized to render a beautiful, clean Welcome page using Tailwind.

**shared/**
- **Purpose:** Shared workspaces for unified configurations and types to be shared between client and API without code duplication.

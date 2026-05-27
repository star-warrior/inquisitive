# Technology Stack

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The technology choices listed below are established by the Product Requirements Document (`dev_docs/prd.md`) and will be implemented in subsequent phases.

## Languages

**Primary:**

- TypeScript 5.x - End-to-end type safety for both frontend application and backend API services.

**Secondary:**

- JavaScript - Configuration files (e.g., Vite, Tailwind, ESLint, Prettier).
- SQL - Database migrations and direct Drizzle schema declarations.

## Runtime

**Environment:**

- Node.js 20.x (LTS) - Standard runtime environment for backend development and frontend tooling.
- Modern Web Browsers - Client-side runtime environment for the React web application.

**Package Manager:**

- npm 10.x - Standard package manager for package management and task running.
- Lockfile: `package-lock.json` (will be generated upon first dependency installation).

## Frameworks

**Core:**

- React 18 - Declarative frontend library for building highly responsive, component-based user interfaces.
- express.js - Minimal, lightweight, and ultra-fast web framework running on Node.js for backend APIs.
- Vite - Rapid development server and module bundler for the React frontend application.

**Testing:**

- Vitest - Modern, fast unit testing framework designed for Vite projects (planned for unit & integration tests).

**Database & ORM:**

- Drizzle ORM - Next-generation, lightweight, type-safe TypeScript ORM for interacting with PostgreSQL.
- Neon Serverless Postgres - Fully managed Postgres database hosting provider.

## Key Dependencies

**Frontend:**

- `@dnd-kit/core` - Lightweight, modular, and highly accessible drag-and-drop toolkit for the Kanban interface.
- `zustand` - Small, fast, and scalable bear-bones state-management solution for global client state.
- `@tanstack/react-query` - Powerful asynchronous state synchronization, caching, and server state management.
- `tailwindcss` - Utility-first CSS framework for rapid and consistent modern UI styling.
- `shadcn/ui` - Accessible, customizable, and visually stunning pre-built component system based on Radix UI primitives.

**Backend & Services:**

- `zod` - TypeScript-first schema declaration and validation library for validating incoming HTTP requests and API responses.
- `groq-sdk` - Client library for accessing Groq's high-speed Llama 3.3 70B inference engine.
- `tavily` - Web search API designed for LLM agents to perform search-and-extract operations.

## Configuration

**Environment:**

- Configuration via `.env` files (using `dotenv` on backend and Vite's built-in env parser on frontend).
- Key variables:
  - `DATABASE_URL` - Database connection URI.
  - `GROQ_API_KEY` - Credentials for Llama 3.3 70B model access.
  - `TAVILY_API_KEY` - Credentials for Tavily search API.
  - `PORT` - Port number for express.js API server.

**Build Configs (planned):**

- `tsconfig.json` - TypeScript compiler and project settings.
- `vite.config.ts` - Bundler and dev server rules.
- `tailwind.config.js` - Utility styling layout constraints and custom design tokens.

## Platform Requirements

**Development:**

- Cross-platform compatible (any OS supporting Node.js 20+).
- Neon Console or local Postgres CLI for schema management and testing.

**Production:**

- Frontend: Vercel - Highly optimized hosting platform for static assets and React apps.
- Backend: Railway or Render - Simple, cost-effective container and Node.js app deployment platforms.
- Database: Neon Serverless - Distributed Serverless Postgres infrastructure.

---

_Stack analysis: 2026-05-26_
_Update after major dependency changes_

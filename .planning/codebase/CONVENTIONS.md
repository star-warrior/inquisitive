# Coding Conventions

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The coding guidelines and patterns listed below establish standard code styles for developers and AI agents to enforce clean, consistent additions.

## Naming Patterns

**Files:**

- `PascalCase.tsx` for React components (e.g., `KanbanColumn.tsx`).
- `kebab-case.ts` for general TypeScript modules, services, configurations, routes, and custom hooks (e.g., `planner-service.ts`, `use-notebooks.ts`).
- `*.test.ts` placed directly alongside target source files.

**Functions:**

- `camelCase` for standard functions, utility helpers, and REST callbacks.
- `handleEventName` pattern for event handlers in UI components (e.g., `handleCardDragEnd`, `handleCreateNotebook`).

**Variables & Constants:**

- `camelCase` for general variable declarations and destructured parameters.
- `UPPER_SNAKE_CASE` for file-level or global static configurations (e.g., `API_BASE_URL`, `DEFAULT_LEVEL`).

**Types & Interfaces:**

- `PascalCase` for type declarations, class names, interfaces, and Zod schemas.
- Interfaces must **never** use the `I` prefix (use `Notebook` instead of `INotebook`).
- Zod schemas suffix with `Schema` (e.g., `CreateNotebookSchema`).

---

## Code Style

**Formatting (Prettier-aligned):**

- 2-space indentation.
- Semicolons required.
- Single quotes for string declarations (except inside JSX attributes, where double quotes are standard).
- Line limit capped at 100 characters for readability.

**TypeScript Configuration:**

- Always enable strict mode (`"strict": true` in `tsconfig.json`).
- Explicitly declare return types for public service APIs and complex helper routines.
- Avoid the `any` keyword; use `unknown` or explicit generics where types are variable.

---

## Import Organization

**Order:**

1. External packages (e.g., `react`, `express`, `@dnd-kit/core`).
2. Absolute mapped directories (e.g., `@/components/`, `@/hooks/` for apps/web).
3. Relative imports (e.g., `./schema`, `../types`).
4. Type-only declarations (`import type { Notebook }`).

_Note: Group imports with a single blank line separating each classification category._

---

## Error Handling

**Backend Strategy:**

- Fail-fast validation at the API threshold using Zod middleware. Invalid request bodies should immediately trigger a `400 Bad Request` containing structured validation details.
- express.js global exception handler catches unhandled exceptions, logs them with context, and returns a clean `500 Internal Server Error` to prevent stack trace leaks.

**Frontend Strategy:**

- Critical async calls wrapped in standard try/catch blocks or using React Query `onError` listeners.
- Notify users of background errors using temporary UI toasts (avoiding blocking alert popups).
- Implement top-level React Error Boundaries to gracefully catch local crashes and show friendly recovery layouts.

---

## Logging

**Guidelines:**

- Never commit active `console.log` statements in final codebase files.
- Use a dedicated structured logger (or basic standard stdout `console.info`/`console.error` wrappers) to track system state changes, model invocations, and database integrations.
- Always attach context objects when logging exceptions:
  `logger.error({ err, deviceId }, 'Notebook creation failed')`.

---

## Function & Module Design

**Function Signatures:**

- Keep functions small and focused on a single responsibility (<50 lines).
- Return early using guard clauses to reduce indentation depth.
- If a function takes more than 3 arguments, encapsulate them inside a single options object:
  `async function createNotebook(options: CreateNotebookOptions)`.

**Module Layout:**

- Named exports are highly preferred for general services, hooks, utilities, and database schemas.
- Default exports are reserved for React route page modules (to enable smooth code-splitting and lazy-loading).

---

_Convention analysis: 2026-05-26_
_Update when patterns change_

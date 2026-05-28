# Inquisitive — AI-Powered Dynamic Knowledge Mapping

Inquisitive is a modern, structured learning workspace designed to convert user curiosity into comprehensive, actionable learning curriculums. By combining search capabilities with generative model pipelines, it transforms open-ended research topics into interactive Kanban learning boards loaded with high-quality articles, tutorial videos, and custom progress tracking.

Built as a modular monorepo using Express.js, React 18 (Vite), TypeScript, Drizzle ORM, Neon serverless PostgreSQL, and Upstash Redis, Inquisitive is engineered for rapid, structured knowledge mapping with production-grade speed, safety guardrails, and total type integrity.

---

## Workspace Modules

The project is structured as a monorepo containing distinct, specialized packages:

| Module | Location | Primary Technologies | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend API** | `/backend` | Node.js, Express, TypeScript, Drizzle ORM, Upstash Rate Limiter | Handles the core generative pipeline, parses request payloads, manages database operations, and enforces API traffic limiters. |
| **Frontend SPA** | `/frontend` | React 18, Vite, Zustand, Framer Motion, dnd-kit, Vanilla CSS | Delivers a high-fidelity client interface with spring-loaded Kanban interactions, progress meters, and responsive layouts. |

---

## System & Data Architecture

Inquisitive utilizes a dual-database stack with a modular flow that bridges high-performance client state with AI orchestration.

### Request & AI Pipeline Flow

The following sequence details how a single search query is validated, structured, enriched, persisted, and visualized on the interactive client:

```mermaid
sequenceDiagram
    autonumber
    actor User as Learner (Client)
    participant Store as Zustand Store (Client)
    participant Server as Express Server (API)
    participant Redis as Upstash Redis (Rate Limiter)
    participant LLM as OpenRouter LLM (Planner & Enricher)
    participant Tavily as Tavily Search Engine
    participant DB as Neon DB (PostgreSQL)

    User->>Store: Submits Topic, Difficulty & Size
    Store->>Server: POST /api/notebook/create (Payload)
    Server->>Redis: Check Rate Limits (slidingWindow limit)
    Redis-->>Server: Limit Approved (Fail-Open Guardrail)
    
    rect rgb(245, 240, 230)
        Note over Server, LLM: Step 1: Input Validation & Curriculum Planning
        Server->>LLM: Generate Chronological Skill-Based Plan (Llama-3.3-70b / DeepSeek)
        LLM-->>Server: Validated Structured Zod JSON (topics list with search queries)
    end

    rect rgb(235, 245, 245)
        Note over Server, Tavily: Step 2: Targeted Dual-Source Crawling (Parallel)
        Server->>Tavily: Parallel crawl: (1) YouTube Videos + (2) Article Docs per topic
        Tavily-->>Server: Multi-source search snippets and URLs
    end

    rect rgb(240, 235, 245)
        Note over Server, LLM: Step 3: Curated Resource Enrichment
        Server->>LLM: Filter and Summarize Best Resources (Llama-3.3-70b / Qwen)
        LLM-->>Server: Curated resources (max 1 video + 1 article per topic, 2-sentence summaries)
    end

    Server->>DB: Insert Notebook & Bulk-Insert Resources (Cascading Foreign Keys)
    DB-->>Server: Persisted Records
    Server-->>Store: JSON Response (Notebook + Curated Resources)
    Store->>User: Route to /notebook/:id (Render springy Kanban & reset loader)
```

---

## Database Schema (Drizzle ORM)

The relational database is structured around two core tables: `notebook` and `resource`.

```mermaid
erDiagram
    notebook {
        uuid id PK "defaultRandom()"
        varchar deviceId "device identification token"
        timestamp created_at "with timezone, defaultNow()"
        varchar topic "search title"
        topic_level level "enum: beginner | intermediate | hard"
        length length "enum: short | medium | long"
    }

    resource {
        uuid id PK "defaultRandom()"
        uuid notebook_id FK "References notebook.id (cascade delete)"
        text title "resource title"
        varchar url "resource web link"
        text thumbnail "youtube image url or null"
        source_type source_type "enum: article | video"
        difficulty difficulty "enum: 1 | 2 | 3 | 4 | 5"
        status status "enum: todo | in_progress | completed | skipped"
        text summary "structured two-sentence summary"
        timestamp created_at "with timezone"
        timestamp updated_at "with timezone"
    }

    notebook ||--o{ resource : "has many (1-to-N)"
```

### Table Definitions

#### Notebook Table (`notebook`)

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | `uuid` | Primary Key, `defaultRandom()` | Unique identifier for each generated learning curriculum. |
| **deviceId** | `varchar(36)` | Not Null | Identifies the client browser or machine that initiated the request. |
| **createdAt** | `timestamp` | `defaultNow()`, With Timezone | Records the execution timestamp of the planning request. |
| **topic** | `varchar(255)` | Not Null | The primary subject or topic parsed by the AI Planner. |
| **level** | `topic_level` | Not Null, Custom Enum | Difficulty tier: `beginner`, `intermediate`, or `hard`. |
| **length** | `length` | Not Null, Custom Enum | Course depth / node count: `short`, `medium`, or `long`. |

#### Resource Table (`resource`)

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | `uuid` | Primary Key, `defaultRandom()` | Unique identifier for the individual learning node. |
| **notebookId** | `uuid` | Foreign Key, References `notebook.id` | Establishes the relationship. Configured with cascading delete behavior. |
| **title** | `text` | Not Null | Curated learning material title. |
| **url** | `varchar(255)` | Not Null | Hyperlink leading to the video tutorial or article documentation. |
| **thumbNail** | `text` | Nullable | Custom YouTube preview image (derived from YouTube API matches). |
| **sourceType** | `source_type` | Not Null, Custom Enum | Type classification: `article` or `video`. |
| **difficulty** | `difficulty` | Not Null, Custom Enum | Structural skill level ranking from `1` (simplest) to `5` (hardest). |
| **status** | `status` | Not Null, Custom Enum | Kanban Board status state: `todo`, `in_progress`, `completed`, or `skipped`. |
| **summary** | `text` | Nullable | Highly concise, action-focused 2-sentence curriculum description. |
| **createdAt** | `timestamp` | `defaultNow()`, With Timezone | Timestamp when resource was fetched and saved. |
| **updatedAt** | `timestamp` | `defaultNow()`, With Timezone | Tracks column transitions or manual metadata edits. |

---

## Design System Tokens & Aesthetics

The client interface utilizes a custom warm editorial design system mapped entirely in Vanilla CSS to avoid layout bloat.

| Token Group | Values / Variables | Application & Visual Experience |
| :--- | :--- | :--- |
| **Background Color** | `#fdfbf7`, `bg-bento-warm` | Warm organic paper base mirroring physical textbook paper texture. |
| **Typography Fonts** | **Outfit**, **Plus Jakarta Sans**, **Sora** | Muted, high-contrast print headlines paired with readable UI labels. |
| **Accents & Borders** | `#D4C4A8`, `border-bento`, `#7c3aed` | Golden sand borders combined with deep violet interactive icons. |
| **Physics & Motion** | `Framer Motion`, `dnd-kit` | Spring-based Kanban node interactions and staggered card dealing. |

---

## Application Walkthrough & Visuals

Here is an overview of the core application viewports. Keep these sections updated with screenshots of your current deployment:

### Dashboard & Smart Search Setup

The clean, minimalist landing workspace allows immediate input, structured filters, and error banner notifications if input validation fails.

```
+----------------------------------------------------------------------------+
|   Inquisitive                                                              |
|                                                                            |
|   What do you want to learn today?                                         |
|   [ How to play Badminton                                              ]   |
|                                                                            |
|   Level: [ Beginner (x) ] [ Intermediate ] [ Advanced ]                    |
|   Size:  [ Short (5 nodes) ] [ Medium (6 nodes) (x) ] [ Long (8 nodes) ]   |
|                                                                            |
|   ( BUTTON: Map Knowledge Base )                                           |
+----------------------------------------------------------------------------+
```
*(Screenshot Space: Place `dashboard_landing.png` here showing the home page)*

---

### High-Fidelity Kanban Board

When the AI orchestrator builds a notebook, resources are organized into an interactive Kanban board. Moving cards immediately recalculates the learning progress bar and syncs back to Neon.

```
+----------------------------------------------------------------------------+
|  Badminton Basics                                    [Progress: 35%] ===-  |
|                                                                            |
|  [ TO DO ]        [ IN PROGRESS ]    [ COMPLETED ]      [ SKIPPED ]        |
|  +--------------+ +---------------+  +---------------+  +---------------+  |
|  | Grip Technique| | Clear Shot    |  | Footwork      |  | Trivia / Hist |  |
|  | [Video]      | | [Article]     |  | [Video]       |  | [Article]     |  |
|  | Summary...   | | Summary...    |  | Summary...    |  | Summary...    |  |
|  +--------------+ +---------------+  +---------------+  +---------------+  |
+----------------------------------------------------------------------------+
```
*(Screenshot Space: Place `kanban_board_view.png` here showing active learning progress and spring-loaded cards)*

---

### Mobile-First Bottom Bars & Columns

For smaller viewports, columns smoothly stack into a responsive layout with touch-friendly dragging handles and a responsive bottom navigation.

*(Screenshot Space: Place `mobile_responsive_view.png` here showing mobile column layouts)*

---

## Getting Started

Follow these steps to run a fully functional development environment locally.

### Prerequisites

| Prerequisite | Minimum Version | Required For |
| :--- | :--- | :--- |
| **Node.js** | 20.x (LTS) | Package runner, builds, and backend operations. |
| **npm** | 10.x | Monorepo workspaces management. |
| **Docker Desktop** | Latest | Running local caching/Redis clusters and emulators. |

---

### 1. Environment Configurations

#### Backend Configuration (`/backend/.env`)

| Variable | Recommended / Default Value | Purpose |
| :--- | :--- | :--- |
| **PORT** | `3000` | Express API port. |
| **NODE_ENV** | `development` | Enables debug loggers and verbose schema checking. |
| **CLIENT_URL** | `"http://localhost:5173"` | Configures CORS allowed origin vectors. |
| **DATABASE_URL** | `postgres://user:pass@ep-host.neon.tech/db` | Neon Serverless PostgreSQL connection string. |
| **OPENROUTER_API** | `your_openrouter_api_key` | Authenticates planner and enricher LLM queries. |
| **TAVILY_API** | `your_tavily_api_key` | Authenticates dual-source parallel web searches. |
| **UPSTASH_REDIS_REST_URL** | `"http://upstash-local:80"` | Points to Upstash emulator Rest URL inside Docker. |
| **UPSTASH_REDIS_REST_TOKEN** | `"example_token_not_needed_locally"` | Mock token for local Upstash emulator operations. |

#### Frontend Configuration (`/frontend/.env`)

| Variable | Default Value | Purpose |
| :--- | :--- | :--- |
| **VITE_API_URL** | `"http://localhost:3000/api"` | Base client entrypoint for REST interactions. |

---

### 2. Infrastructure Setup (Docker Compose)

The repository includes a customized Docker environment that runs a local Postgres-compatible Redis Stack (`redis-stack`) along with an Upstash HTTP Translator container (`upstash-local`), allowing `@upstash/ratelimit` to resolve without real Upstash Cloud credentials.

Boot all core database and caching services concurrently:
```bash
docker compose -f docker-compose.dev.yaml up --build
```

This initializes:
- **Redis Stack**: Running on standard port `6379`.
- **RedisInsight GUI**: Available on port `8001` for real-time key inspection.
- **Serverless Redis HTTP Emulator**: Translation bridge available on port `8079` (maps internal container port `80`).

---

### 3. Application Execution

Install all workspace dependencies from the root directory:
```bash
npm install
```

Boot the frontend Vite server and backend Express server concurrently using workspace scripts:
```bash
npm run dev:frontend  # Boots React + Vite Client (http://localhost:5173)
npm run dev:backend   # Boots Express API Server (http://localhost:3000)
```

---

## Unified Scripts Index

Execute commands directly from the monorepo root:

| Command | Action | Workspace / Scope |
| :--- | :--- | :--- |
| `npm run dev:frontend` | Boots the Vite client environment with proxy mappings. | `frontend` |
| `npm run dev:backend` | Boots Express server with TS-Node-Dev live-reloading. | `backend` |
| `npm run build` | Builds and transpiles all client and backend production assets. | Monorepo Root |

---

## API Routes Reference

The backend exposes these core routes under `/api`:

### Notebooks Endpoint (`/api/notebook`)

| Method | Route | Request Payload | Behavior / Function |
| :--- | :--- | :--- | :--- |
| **GET** | `/getAll` | None | Retrieves all saved learning notebooks for the active device. |
| **POST** | `/create` | `{ topic: string, level: string, length: string }` | Triggers the dual-stage AI orchestrator pipeline to validate the query, plan skills, crawl the web, enrich resources, persist structures, and return the final JSON. |
| **DELETE** | `/:id` | None | Deletes a notebook and cascades deletion to all associated resources. |

### Resources Endpoint (`/api/resources`)

| Method | Route | Request Payload | Behavior / Function |
| :--- | :--- | :--- | :--- |
| **GET** | `/:notebookId` | None | Retrieves all learning materials associated with a specific notebook. |
| **DELETE** | `/:id` | None | Deletes a single learning node card. |
| **PATCH** | `/update/:id` | `{ status: string }` | Updates the card's column status (e.g. `todo` to `in_progress`, `completed`, or `skipped`) in the database. |

---

*Inquisitive — Beautiful, structured, agentic knowledge curation for lifelong learners.*

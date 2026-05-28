# 🔮 Inquisitive — AI-Powered Dynamic Knowledge Mapping

Inquisitive is a state-of-the-art learning workspace designed to convert user curiosity into comprehensive, structured, and action-oriented learning curriculums. By combining raw search capabilities with advanced generative model pipelines, it transforms open-ended research topics into interactive Kanban learning boards loaded with high-quality articles, tutorial videos, and custom progress tracking.

Built as a high-fidelity monorepo using **Express.js**, **React 18 (Vite)**, **TypeScript**, **Drizzle ORM**, **Neon serverless PostgreSQL**, and **Upstash Redis**, Inquisitive is engineered for rapid, structured knowledge mapping with production-grade speed, safety guardrails, and type integrity.

---

## 🏗️ System & Data Architecture

Inquisitive utilizes a robust, modern dual-database monorepo stack with a modular flow that bridges high-performance client state with AI orchestration.

### 🔄 Request & AI Pipeline Flow
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

## 💾 Database Schema (`drizzle-orm`)

The database model is kept extremely clean and light, optimized for relational speed and integrity. It features cascading deletes, foreign keys, and targeted index configurations:

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

### Key DB Attributes
- **Topic Level Badge**: Uses native PostgreSQL enums (`beginner`, `intermediate`, `hard`) for strict type safety.
- **Cascading Deletions**: Deleting a notebook dynamically purges all its referenced resources at the database level.
- **Relational Indices**: A custom index on the `notebook_id` field in the `resource` table speeds up relational queries under heavy loads.

---

## 🎨 Warm Editorial Design System

Inquisitive features a high-fidelity **Warm Editorial Aesthetic** designed to mirror the sensory pleasure of high-end print design.

- **Centralized Palette**: Uses soft warm organic background layers (`#fdfbf7`, `bg-bento-warm`), charcoal primary headers (`#111`), and golden sand accent lines (`#D4C4A8`) which contrast with beautiful violet key icons and glowing indicators.
- **Visual Typography**: Employs elegant **Outfit** for clean, readable layout structures and high-end headings, accompanied by **Plus Jakarta Sans** and **Sora** for UI controls.
- **Dynamic Physics**: Micro-interactions, spring-based Kanban card drops, and staggered entrance animations are animated with `Framer Motion` and custom layout transitions.

---

## 📸 Application Walkthrough & Visuals

Here is an overview of the core application viewports. Keep these sections updated with screenshots of your current deployment:

### 1. Dashboard & Smart Search Setup
The clean minimalist landing workspace allows immediate input, structured filters, and error banner notifications if input validation fails.

```
+----------------------------------------------------------------------------+
|  🔮 Inquisitive                                                            |
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
*(Screenshot Space: Place `dashboard_landing.png` here showing the warm editorial home page)*

---

### 2. High-Fidelity Kanban Board
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

### 3. Mobile-First Bottom Bars & Columns
For smaller viewports, columns smoothly stack into a responsive layout with touch-friendly dragging handles and a responsive bottom navigation.

*(Screenshot Space: Place `mobile_responsive_view.png` here showing mobile column layouts)*

---

## ⚡ Getting Started

Follow these steps to run a fully functional development environment locally.

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Docker Desktop** (Required to run local Redis rate limiters and Upstash HTTP emulators)

---

### 1. Environment Configurations
Create `.env` files in both backend and frontend.

#### 🔸 Backend Config (`/backend/.env`)
```bash
PORT=3000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"

# database parameters (Neon Serverless PostgreSQL connection string)
DATABASE_URL="postgres://user:pass@ep-cool-name-1234.us-east-2.aws.neon.tech/neondb?sslmode=require"

# API keys (Required for the generative pipeline)
OPENROUTER_API="your_openrouter_api_key"
TAVILY_API="your_tavily_api_key"

# Docker Upstash Redis Local Emulator Configuration
UPSTASH_REDIS_REST_URL="http://upstash-local:80"
UPSTASH_REDIS_REST_TOKEN="example_token_not_needed_locally"
```

#### 🔸 Frontend Config (`/frontend/.env`)
```bash
VITE_API_URL="http://localhost:3000/api"
```

---

### 2. Up & Running (Docker Compose)
The repository includes a customized Docker environment that runs a local Postgres-compatible Redis Stack (`redis-stack`) along with an Upstash HTTP Translator container (`upstash-local`), allowing `@upstash/ratelimit` to resolve without real Upstash Cloud credentials!

Boot all core database & caching services concurrently:
```bash
docker compose -f docker-compose.dev.yaml up --build
```
This initializes:
- **Redis Stack**: Running on standard port `6379`.
- **RedisInsight GUI**: Available on port `8001` for real-time key inspection.
- **Serverless Redis HTTP Emulator**: Translation bridge available on port `8079` (maps internal container port `80`).

---

### 3. Running the Code base
Install dependencies from the root directory:
```bash
npm install
```

Boot the frontend Vite server and backend Express server concurrently:
```bash
# From the root directory:
npm run dev:frontend  # Boots React + Vite Client (http://localhost:5173)
npm run dev:backend   # Boots Express API Server (http://localhost:3000)
```

---

## 🚀 Unified Scripts Index

Execute commands directly from the monorepo root:

| Command | Action | Workspace / Scope |
| :--- | :--- | :--- |
| `npm run dev:frontend` | Boots the Vite client environment with proxy mappings. | `frontend` |
| `npm run dev:backend` | Boots Express server with TS-Node-Dev live-reloading. | `backend` |
| `npm run build` | Builds and transpiles all client and backend production assets. | Monorepo Root |

---

## 🔌 API Routes Reference

The backend exposes these core routes under `/api`:

### 🔹 Notebooks (`/api/notebook`)
- **`GET /getAll`**: Retrieves all saved learning notebooks for the active device.
- **`POST /create`**: Triggers the dual-stage AI orchestrator pipeline to validate the query, plan skills, crawl the web, enrich resources, persist structures, and return the final JSON.
- **`DELETE /:id`**: Deletes a notebook and cascades deletion to all associated resources.

### 🔹 Resources (`/api/resources`)
- **`GET /:notebookId`**: Retrieves all learning materials associated with a specific notebook.
- **`DELETE /:id`**: Deletes a single learning node card.
- **`PATCH /update/:id`**: Updates the card's column status (e.g. `todo` ➔ `in_progress` ➔ `completed` ➔ `skipped`) in the database.

---

*🔮 Inquisitive — Beautiful, structured, agentic knowledge curation for lifelong learners.*

# AI Learning Workspace — PRD v1.0

> Phase 1: AI Curation + Kanban Learning Workflow

---

## Product Vision

An AI-powered learning workspace that eliminates information overload.

Instead of spending hours searching YouTube and articles, users get a curated, personalized learning board with actionable resources — organized into a simple Kanban workflow they can execute immediately.

> **Core philosophy: Discover → Organize → Execute → Learn**

This is not a Notion clone.  
This is not a NotebookLM clone.  
This is an AI-assisted execution system for learning any hobby or skill.

---

## Problem Statement

**Current learning flow (broken):**

1. User searches a topic
2. Opens many tabs
3. Watches random videos
4. Gets overwhelmed
5. Quits

**Pain points:**

- Information overload with no structure
- No clear progression path
- No sense of progress or completion
- Hard to know what actually matters for your goal level

**Solution:**  
Reduce learning chaos into a guided, curated workflow with 5–8 focused techniques — matched to the user's goal level.

---

## User Story

> As a user, I want to learn any topic (Chess, Guitar, Programming, UI Design, Poker, ML, etc.) without spending hours searching for content — so that I can immediately start learning.

---

## Phase 1 Scope

Phase 1 covers only:

✅ AI-powered notebook creation  
✅ Curated resource enrichment (Groq + Tavily)  
✅ Kanban learning workflow with drag-and-drop  
✅ Progress tracking  
✅ Local device persistence (no auth)

❌ No RAG  
❌ No document/PDF ingestion  
❌ No NotebookLM features  
❌ No authentication  
❌ No social features

---

## Core User Flow

```
User opens app
↓
Enters: Topic + Level + Length
↓
AI Planner generates 5–8 focused learning topics (Groq)
↓
Resource Enricher fetches relevant YouTube videos + articles (Tavily)
↓
Results normalized and stored in DB
↓
Kanban board auto-created with resource cards
↓
User moves cards: Todo → Doing → Done (or Skipped)
↓
Progress persists across sessions via device_id
```

---

## Notebook Creation

### Input Fields

| Field      | Options                                                       |
| ---------- | ------------------------------------------------------------- |
| **Topic**  | Free text — e.g. "Learn Chess", "Learn Guitar", "Learn React" |
| **Level**  | Beginner / Intermediate / Advanced                            |
| **Length** | Short (5 topics) / Medium (6–7 topics) / Long (8 topics)      |

### Notes

- No signup required
- Each device gets a UUID on first visit stored in `localStorage`
- All data scoped to this `device_id`

---

## AI Planning Layer

**Purpose:** Convert a vague goal into structured, ordered learning units.

**Input:**

```json
{
  "topic": "Chess",
  "level": "Beginner",
  "length": "Short"
}
```

**Prompt responsibilities:**

- Generate 5–8 units ordered by progression
- Practical skills only — no history, trivia, or theory overload
- Estimate difficulty per unit (1–5)
- Return strict JSON — no prose

**Example output:**

```json
[
  { "title": "How pieces move", "difficulty": 1 },
  { "title": "Basic checkmate patterns", "difficulty": 2 },
  { "title": "Opening principles", "difficulty": 2 },
  { "title": "Tactics: Forks and Pins", "difficulty": 3 },
  { "title": "Endgame basics", "difficulty": 3 }
]
```

**Important:** The planner only generates topic titles and difficulty. It does NOT fetch resources.

---

## Resource Enrichment Layer

**Purpose:** For each planned topic, find real high-quality resources.

**Tools used:** Groq (LLM) + Tavily (web search)

**Per topic, fetch:**

- 1–2 relevant YouTube videos
- 1–2 articles or blog posts

**Resource metadata stored:**

```json
{
  "title": "string",
  "url": "string",
  "thumbnail": "string",
  "source_type": "video | article",
  "difficulty": 1,
  "summary": "2–3 sentence AI summary"
}
```

**Flow:**

```
Planner output topics
↓
For each topic → Tavily search → fetch results
↓
Groq normalizes + summarizes
↓
Store in DB
↓
Attach to Kanban cards
```

---

## Kanban System

### Columns

| Column         | Meaning                 |
| -------------- | ----------------------- |
| 📋 **Todo**    | Not started yet         |
| 🔥 **Doing**   | Currently learning      |
| ✅ **Done**    | Completed               |
| ❌ **Skipped** | Not relevant / too hard |

### Rules

- Drag and drop via `@dnd-kit/core` (not react-beautiful-dnd — deprecated)
- Card move = DB state update only
- **No AI calls on card move** — Kanban is pure state management
- Position order within columns is persisted

### Why No AI on Kanban Actions

Triggering AI on every card move would be:

- Expensive (API costs)
- Slow (bad UX)
- Unnecessary (user just wants to move a card)

Card moved → persist state. Simple.

---

## Progress Tracking

- Overall progress % = `Done cards / Total cards`
- Visual progress bar shown on notebook header
- Per-column card counts displayed
- Skipped cards excluded from progress calculation

---

## Database Schema

### `notebooks`

```sql
id          UUID PRIMARY KEY
device_id   TEXT NOT NULL        -- anonymous user identifier
topic       TEXT NOT NULL
level       TEXT NOT NULL        -- beginner | intermediate | advanced
length      TEXT NOT NULL        -- short | medium | long
created_at  TIMESTAMP DEFAULT NOW()
```

### `resources`

```sql
id           UUID PRIMARY KEY
notebook_id  UUID REFERENCES notebooks(id) ON DELETE CASCADE
title        TEXT NOT NULL
url          TEXT NOT NULL
thumbnail    TEXT
source_type  TEXT NOT NULL       -- video | article
summary      TEXT
difficulty   INTEGER             -- 1–5
status       TEXT DEFAULT 'todo' -- todo | doing | done | skipped
position     INTEGER NOT NULL    -- order within column
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

**Note:** No separate `kanban_cards` table. Status and position live directly on `resources` — fewer joins, simpler queries.

---

## Tech Stack

### Frontend

| Layer        | Choice                   | Reason                                                     |
| ------------ | ------------------------ | ---------------------------------------------------------- |
| Framework    | React 18 + Vite          | Fast builds, optimal bundle                                |
| Language     | TypeScript               | Type safety                                                |
| Styling      | Tailwind CSS + shadcn/ui | Clean, accessible components                               |
| Drag & Drop  | `@dnd-kit/core`          | Lightweight, accessible, react-beautiful-dnd is deprecated |
| State        | Zustand                  | Lightweight, simple                                        |
| Server State | React Query (TanStack)   | Caching, loading states, refetch                           |

### Backend

| Layer      | Choice     | Reason                                    |
| ---------- | ---------- | ----------------------------------------- |
| Runtime    | Node.js    | Familiar, large ecosystem                 |
| Framework  | express    | Lighter + faster than Express, edge-ready |
| Language   | TypeScript | Type safety end-to-end                    |
| Validation | Zod        | Schema validation, pairs with TypeScript  |
| ORM        | Drizzle    | Type-safe, lightweight vs Prisma          |

### Database & Infrastructure

| Layer           | Choice               | Reason                                         |
| --------------- | -------------------- | ---------------------------------------------- |
| Database        | PostgreSQL via Neon  | Serverless Postgres, generous free tier        |
| AI / LLM        | Groq (Llama 3.3 70B) | Highest free rate limits (30 RPM / 14,400/day) |
| Search          | Tavily API           | Web search + content extraction, free tier     |
| Frontend Deploy | Vercel               | Free, fast, CI/CD                              |
| Backend Deploy  | Railway or Render    | Free tier, simple Node deploys                 |

### What We Dropped (and Why)

| Dropped           | Reason                                                                          |
| ----------------- | ------------------------------------------------------------------------------- |
| Redis             | Overkill for Phase 1 — no background jobs yet                                   |
| BullMQ            | No async queue needed — synchronous enrichment with loading state is sufficient |
| Auth (Clerk etc.) | Replaced by anonymous `device_id` pattern                                       |
| Prisma            | Drizzle is lighter and equally type-safe                                        |

---

## API Design

```
POST   /api/notebooks              Create notebook, trigger AI plan + enrichment
GET    /api/notebooks              List all notebooks for device_id
GET    /api/notebooks/:id          Get notebook with all resources
DELETE /api/notebooks/:id          Delete notebook

PATCH  /api/resources/:id/status   Update card status (todo/doing/done/skipped)
PATCH  /api/resources/:id/position Reorder card within column
```

**Auth pattern (no signup):**

- Frontend generates `device_id = crypto.randomUUID()` on first load
- Stored in `localStorage`
- Sent as `x-device-id` header on every request
- Backend middleware validates presence and scopes all DB queries to it

---

## Anonymous User Identity

```
First visit
↓
crypto.randomUUID() → stored in localStorage as 'device_id'
↓
Sent as header: x-device-id on every request
↓
Backend scopes all queries: WHERE device_id = ?
```

**Known tradeoffs (documented in README):**

- Clearing localStorage = losing access to existing notebooks
- Different browser/device = different identity
- Acceptable for Phase 1 — auth migration path is clean (just replace `device_id` with `user_id`)

---

## Project Structure

```
/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Route-level pages
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── lib/            # Utilities, API client
│   │   │   └── types/          # Shared TypeScript types
│   │   └── ...
│   └── api/                    # express.js backend
│       ├── src/
│       │   ├── routes/         # Route handlers
│       │   ├── services/       # Business logic (AI, search)
│       │   ├── db/             # Drizzle schema + queries
│       │   ├── middleware/      # device-id, error handling
│       │   └── types/          # Zod schemas
│       └── ...
└── README.md
```

---

## Non-Goals (Phase 1)

- ❌ Authentication / user accounts
- ❌ Social features or sharing
- ❌ Settings screen
- ❌ Chat-first UX
- ❌ PDF or document ingestion
- ❌ RAG / vector search
- ❌ Over-engineered agent loops
- ❌ MCQ quizzes or audio-only learning

---

## Success Metrics

| Metric                           | Target                            |
| -------------------------------- | --------------------------------- |
| Notebook creation (end-to-end)   | < 10 seconds                      |
| Kanban interactions              | Instant (optimistic UI)           |
| Resources generated per notebook | 5–8 curated items                 |
| Perceived loading states         | Skeleton loaders on all async ops |
| Data persistence                 | Survives page refresh             |

---

## Phase 2 Preview (NotebookLM Layer)

Only after Phase 1 is stable and users can add their own resources.

**Planned:**

- PDF upload → text extraction → chunking
- YouTube transcript ingestion
- Webpage ingestion
- Embeddings → Vector DB (pgvector)
- RAG: "Explain this topic from my resources"

**Future DB additions:**

```sql
resource_chunks { id, resource_id, chunk_text, embedding }
```

---

## Final Principle

> **AI decides WHAT matters.**  
> **Kanban helps users DO it.**  
> **Future NotebookLM explains WHY.**

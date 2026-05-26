# External Integrations

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The external integrations listed below are planned integration patterns defined in the Product Requirements Document (`dev_docs/prd.md`).

## APIs & External Services

**Artificial Intelligence / LLM:**
- **Groq API (Llama 3.3 70B)** - Core AI planning layer used to parse user learning goals and generate structured 5–8 unit learning topics.
  - SDK/Client: `groq-sdk` npm package.
  - Auth: API key passed via standard `GROQ_API_KEY` environment variable.
  - Usage: Invoked on notebook creation to generate course outlines and provide summaries of found resources.

**Web Search & Extraction:**
- **Tavily API** - High-speed, LLM-optimized web search engine used to fetch high-quality YouTube videos and articles/blog posts for each learning topic.
  - SDK/Client: REST API integrations or `tavily` client SDK if applicable.
  - Auth: API key stored in `TAVILY_API_KEY` environment variable.
  - Usage: Triggered automatically during the enrichment phase of notebook creation.

## Data Storage

**Databases:**
- **Neon Serverless Postgres** - Primary, fully managed PostgreSQL database for persisting user notebooks, resource mappings, and learning states.
  - Connection: Connection pooler strings configured via `DATABASE_URL` environment variable.
  - Client: Drizzle ORM to perform lightweight, type-safe queries.
  - Migrations: Managed and executed using `drizzle-kit` CLI commands.

**File Storage:**
- *None in Phase 1* (Resource cards use external YouTube thumbnails and website favicon/meta image links directly).

**Caching & Queuing:**
- *None in Phase 1* (Redis and BullMQ dropped from initial scope to optimize complexity. Search enrichment runs synchronously with frontend loading state/skeleton indicators).

## Authentication & Identity

**Anonymous Identity (No Signup):**
- **Anonymous Device ID Pattern** - Scopes notebooks and resources to individual user devices.
  - Implementation: Frontend automatically generates a UUID (`crypto.randomUUID()`) on first visit, saving it in the browser's `localStorage` as `device_id`.
  - Header: Injected on every API request via a custom header: `x-device-id`.
  - Middleware: Hono.js custom backend middleware validates the existence of this header and automatically scopes database reads, writes, and deletes: `WHERE device_id = ?`.
  - Migration path: Designed to be modular so that it can be seamlessly upgraded to standard user accounts (e.g., Clerk, Supabase Auth) in Phase 2 by substituting `device_id` with `user_id`.

## CI/CD & Deployment

**Hosting:**
- **Vercel** - Hosts the compiled React + Vite frontend application.
  - Deployment: Auto-triggered CI/CD builds on every git commit push to the `main` branch.
  - Env Sync: Environment variables configured globally in the Vercel project panel.
- **Railway / Render** - Containers for deploying the lightweight Hono.js API server.
  - Deployment: Automatic deployments hooked directly into the project repository.

## Environment Configuration

**Development Environment (.env):**
- Required variables:
  - `DATABASE_URL` - Neon database connection string.
  - `GROQ_API_KEY` - Groq platform credential.
  - `TAVILY_API_KEY` - Tavily search key.
  - `PORT` - Port number for the API server (typically `3000`).

---

*Integration audit: 2026-05-26*
*Update when adding/removing external services*

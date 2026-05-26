# Codebase Concerns

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The concerns listed below represent pre-identified technical risks, architectural tradeoffs, and performance limits highlighted during design modeling to watch out for during physical code building.

## Architectural Tradeoffs & Tech Debt

**Synchronous Content Enrichment:**
- **Issue:** The Tavily search query fetch and Groq summarization are handled synchronously inside the `POST /api/notebooks` execution lifecycle.
- **Why:** Redis and BullMQ were intentionally dropped from Phase 1 scope to keep the initial development footprint lightweight and highly deployable.
- **Impact:** Notebook creation could take up to 5–8 seconds depending on external API response latency, leading to potential browser timeouts if not managed.
- **Mitigation:**
  1. The frontend must implement highly descriptive skeleton loaders and progress state indicators.
  2. The backend must run topic search queries in parallel (`Promise.all`) rather than in serial to minimize the request cycle.

**Anonymous Device ID Persistence:**
- **Issue:** All data scope checks rely solely on `device_id` stored in the client browser's `localStorage`.
- **Why:** Replaces complex authentication workflows (e.g., Clerk, Supabase Auth) in the initial milestone to accelerate delivery.
- **Impact:** Clearing local cache or browsing in Incognito mode results in immediate loss of access to existing notebooks. Multi-device syncing is not supported.
- **Mitigation:** Document this behavior clearly in the user interface. Keep database access scoped to prevent unauthorized access via manually entered headers.

---

## Technical Risks & Fragile Areas

**LLM Output Consistency:**
- **Issue:** The AI Planner service requires strict JSON output (e.g., matching the `[{ "title": "...", "difficulty": 1 }]` schema).
- **Why:** LLMs can occasionally return conversational filler text, Markdown wrappers (e.g., ```json), or incomplete arrays if they hit token limits.
- **Impact:** Malformed AI response payloads will crash standard JSON parsers and fail notebook creation.
- **Mitigation:** Write a robust extraction utility utilizing regex matching (e.g., extracting substrings between the first `[` and last `]`) to isolate and safely parse JSON arrays.

**Cascade Database Deletion:**
- **File:** `apps/api/src/db/schema.ts` (resources table relationship definition)
- **Risk:** Deleting a notebook must clean up all referenced resources. Missing cascading constraints will result in orphaned resource rows and foreign key failures.
- **Mitigation:** Always declare the foreign key relationship with `onDelete: 'cascade'` explicitly in the Drizzle schema.

---

## Security Considerations

**API Header Spoofing:**
- **Risk:** Since the custom header `x-device-id` determines query scoping, a malicious user could theoretically spoof this header to read or modify another user's notebook data if they guess or obtain their UUID.
- **Mitigation:**
  - Validate the `x-device-id` header format on the backend (verify it is a valid UUIDv4 structure).
  - Add standard API rate limiting (e.g., using Hono's rate limiter) to prevent brute-force UUID probing.

---

## Scaling Limits & API Quotas

**Search & Inference API Limits:**
- **Groq Llama 3.3 70B:** Generous free limit of 30 RPM (Requests Per Minute).
- **Tavily Search API:** The free tier allows **1,000 search queries per month**.
- **The Bottle Neck:** Creating a single medium-length notebook (6–7 topics) triggers 1 planning request and 6–7 independent Tavily search requests. Under these constraints, **fewer than 150 notebooks can be created per month** before exhausting the free search quota.
- **Mitigation:**
  - Cache results locally for common search queries.
  - Implement fallback stubs for developers or standard mock payloads during testing.

---

*Concerns audit: 2026-05-26*
*Update as issues are fixed or new ones discovered*

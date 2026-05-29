# Roadmap: Inquisitive Milestone v1.0

## Milestone v1.0

| Phase | Description | Status | Requirements |
|-------|-------------|--------|--------------|
| 1 | Redis and IP-based Rate Limiting Refactor | Complete    | 2026-05-28 |
| 2 | UI Theme Audit and Fix | Unstarted    | 2026-05-28 |
| 3 | Daily Learning Streak Mechanism | Complete    | 2026-05-29 |

### Phase 2: UI Theme Audit and Fix

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 1
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 2 to break down)

### Phase 3: Daily Learning Streak Mechanism

**Goal:** Implement client-side daily learning streak calculations in localStorage with smooth React hooks and visual flame badge displays in the Notebook header.
**Requirements**: REQ-STRK-01, REQ-STRK-02, REQ-STRK-03, REQ-STRK-04, REQ-STRK-05, REQ-STRK-06
**Depends on:** Phase 1
**Plans:** 1 plan

Plans:
- [x] 03-01: Implement streak utility, useStreak custom hook, and StreakBadge UI component

---

### Phase 1: Redis and IP-based Rate Limiting Refactor

- **Goal**: Refactor the rate limiting mechanism in the backend using a Redis store and IP-based limiters to improve security, scalability, and efficiency.
- **Deliverables**:
  - Redis connection setup and configuration in the backend.
  - Refactored `backend/src/config/rateLimiter.ts` using Redis store.
  - Integration of the Redis rate limiter with the backend routes.
- **Success Criteria**:
  - Redis-backed rate limiting applies to all backend API endpoints.
  - Custom rate limits correctly enforced by client IP address.
  - Integration tests or manual verification passes.

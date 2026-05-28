# Roadmap: Inquisitive Milestone v1.0

## Milestone v1.0

| Phase | Description | Status | Requirements |
|-------|-------------|--------|--------------|
| 1 | Redis and IP-based Rate Limiting Refactor | Complete    | 2026-05-28 |

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

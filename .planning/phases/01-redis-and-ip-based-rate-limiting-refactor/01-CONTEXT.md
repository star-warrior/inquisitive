# Phase 1: Redis and IP-based Rate Limiting Refactor - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning
**Source:** User Request

<domain>
## Phase Boundary
This phase refactors Inquisitive's backend rate limiting middleware to use a Redis store, protecting all public endpoints by tracking request counts against client IP addresses. It specifically modifies `backend/src/config/rateLimiter.ts` and applies it correctly in the main Express application.
</domain>

<decisions>
## Implementation Decisions

### Rate Limiting Mechanism
- **Redis Store**: Use the Redis database as the key-value store for rate limiting (using `rate-limit-redis` and `redis` client packages).
- **IP-Based Tracking**: Rate limit requests strictly based on the client's IP address.
- **Client Trust**: Ensure `trust proxy` is correctly configured in Express (`app.set('trust proxy', 1)`) so that client IP addresses behind reverse proxies (like fly.io or AWS ALB) are accurately identified.

### Limit Thresholds
- **General Limiter**: 100 requests per 15 minutes.
- **AI Service Limiter**: 5 requests per hour (since AI calls are resource-heavy).
- **Standard Headers**: Include standard `RateLimit-*` headers (draft-8) and disable the legacy `X-RateLimit-*` headers.

### the agent's Discretion
- Redis connection robustness: if Redis is unavailable, the rate limiter should log an error.
</decisions>

<canonical_refs>
## Canonical References
- `backend/src/config/rateLimiter.ts` — Code being refactored
- `backend/src/app.ts` — Main Express app where rate limiter is registered
</canonical_refs>

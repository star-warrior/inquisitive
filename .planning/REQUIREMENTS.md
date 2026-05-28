# Requirements: Inquisitive Rate Limiting

## Active Milestone: v1.0

### Rate Limiting and Security (SEC)

- **REQ-SEC-01**: Implement Redis-backed rate limiting to handle scalable, multi-instance production environments.
- **REQ-SEC-02**: Rate limit requests based on the client's IP address.
- **REQ-SEC-03**: Configure separate, realistic limits for general API requests (e.g., 100 requests per 15 mins) and expensive AI operations (e.g., 5 requests per hour).
- **REQ-SEC-04**: Maintain standard rate limit headers (RateLimit-*) in API responses.

# Requirements: Inquisitive Rate Limiting

## Active Milestone: v1.0

### Rate Limiting and Security (SEC)

- **REQ-SEC-01**: Implement Redis-backed rate limiting to handle scalable, multi-instance production environments.
- **REQ-SEC-02**: Rate limit requests based on the client's IP address.
- **REQ-SEC-03**: Configure separate, realistic limits for general API requests (e.g., 100 requests per 15 mins) and expensive AI operations (e.g., 5 requests per hour).
- **REQ-SEC-04**: Maintain standard rate limit headers (RateLimit-*) in API responses.

### Daily Learning Streak (STRK)

- **REQ-STRK-01**: Increment the daily streak by 1 when a resource card status changes to completed ("done").
- **REQ-STRK-02**: Moving resource cards to any other status (todo, in_progress, skipped) must not affect the daily streak.
- **REQ-STRK-03**: If the user misses a day (no completed cards on the previous calendar day), the streak must reset to 1 upon their next resource completion.
- **REQ-STRK-04**: Maintain streak data (current streak, longest streak, and last active date YYYY-MM-DD) fully in browser `localStorage` under a single key, handling corrupted/empty data gracefully.
- **REQ-STRK-05**: Render a compact visual flame badge in the notebook detail page header showing the current streak count, displaying the longest streak as subtitle/tooltip, and hiding completely if the current streak is 0.
- **REQ-STRK-06**: Integrate the dynamic streak hook with the desktop/mobile sidebar to render live streak progress, using an active orange filled bounce animation when the streak is > 0 and a muted inactive state at 0.

### Loader and Notebook Limits (LNL)

- **REQ-LNL-01**: Implement a frontend landing page loader that polls the backend `/health` route until it returns a 200 OK "ready" response.
- **REQ-LNL-02**: Preload/load out the main hero image on the landing page while waiting for the health check.
- **REQ-LNL-03**: Create a backend service function `countUserNotebooks` to count the notebooks created by a user.
- **REQ-LNL-04**: In the backend notebook `/create` route, check if the notebook count is 5 or more. If so, return a notification/error indicating that the free tier only allows 5 notebooks.

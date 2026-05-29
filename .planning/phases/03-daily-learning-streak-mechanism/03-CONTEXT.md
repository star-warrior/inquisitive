# Phase 3: Daily Learning Streak Mechanism - Context

**Gathered:** 2026-05-29
**Status:** Ready for planning
**Source:** User Request

<domain>
## Phase Boundary
This phase implements a daily learning streak tracker entirely on the client side using browser `localStorage` for Inquisitive (Phase 1). It creates a pure TypeScript streak utility module, a wrapping custom React hook, and a visual StreakBadge UI component. It integrates the trigger into Zustand's kanban store and displays the badge beside the progress bar on the Notebook page.
</domain>

<decisions>
## Implementation Decisions

### Streak Rules & Calculation
- **Active Trigger:** A streak increments when a resource card's status is changed to `"completed"` (representing "done"). No other status changes count.
- **Increment Constraint:** Calling `markActivity` multiple times on the same day is a no-op — it must not increment the streak more than once per day.
- **Streak Continuity:** A streak continues if the user completes a card today and had also completed at least one card yesterday.
- **Streak Reset:** If a user misses a day (was not active yesterday), the streak is reset to 1 on their next active day (when they complete a resource).
- **Date Comparison:** Standardize date comparison using local ISO calendar date strings (`YYYY-MM-DD`). Avoid using UTC ISO strings to prevent incorrect day changes due to timezone offsets.

### Storage Strategy
- **Local Storage:** Store all streak data under a single consistent `localStorage` key (`"inquisitive_streak"`).
- **Object Schema:**
  ```json
  {
    "currentStreak": 3,
    "lastActiveDate": "2026-05-29",
    "longestStreak": 5
  }
  ```
- **Error Resilience:** Gracefully catch, default, and recover from corrupt, missing, or empty `localStorage` data without throwing runtime exceptions.

### UI styling & Placement
- **Component**: Create `StreakBadge.tsx` displaying a flame icon (`lucide-react`), the current streak count, and a label.
- **Hiding Rule**: The badge renders nothing if the current streak is 0.
- **Placement**: Place the badge in the notebook detail page header, alongside the progress percentage bar.
- **Design Alignment**: Use the "warm editorial" theme, integrating custom card/border styles, clean typography, hover transitions, and a subtle flame glow/color palette (e.g. orange/amber).

### Discretion & Engineering Quality
- **Pure Functions**: The streak calculations must be pure, synchronous, and independently unit-testable.
- **Performance**: Hook updates must be clean, updating state only when streak properties actually change to avoid unnecessary React re-renders.
</decisions>

<canonical_refs>
## Canonical References
- `frontend/src/lib/streak.ts` — [NEW] Pure TypeScript streak calculations
- `frontend/src/hooks/useStreak.ts` — [NEW] Custom React hook wrapping the utility
- `frontend/src/components/StreakBadge.tsx` — [NEW] UI component matching warm editorial styling
- `frontend/src/stores/kanbanStore.ts` — Optimistic state updater where `markActivity` is triggered
- `frontend/src/pages/NotebookPage.tsx` — View displaying the notebook details and StreakBadge
</canonical_refs>

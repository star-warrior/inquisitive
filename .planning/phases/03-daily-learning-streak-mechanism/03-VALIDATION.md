---
phase: 3
slug: daily-learning-streak-mechanism
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-29
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest / Vitest (none installed, will use inline validation) |
| **Config file** | none |
| **Quick run command** | `npm run build --workspace=frontend` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run TypeScript compile check (`npm run build`)
- **Before `/gsd-verify-work`:** Successful frontend build with zero TS/lint errors.
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | REQ-STRK-01 | compilation | `npm run build --workspace=frontend` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | REQ-STRK-02 | compilation | `npm run build --workspace=frontend` | ✅ | ⬜ pending |
| 03-01-03 | 01 | 1 | REQ-STRK-03 | compilation | `npm run build --workspace=frontend` | ✅ | ⬜ pending |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Streak Increments | REQ-STRK-01 | Requires browser state simulation | Drag a card to Completed column and verify the flame badge appears in the header and increments. |
| Missed Day Reset | REQ-STRK-02 | Requires time travel simulation | Manually update `localStorage` date to 2 days ago, drag another card to Completed, and verify the streak resets to 1. |
| Streak Retention | REQ-STRK-03 | Requires browser refresh | Refresh the page and check that the current streak is retained from localStorage. |

# Testing Patterns

**Analysis Date:** 2026-05-26

> [!NOTE]
> This is a **Greenfield Project** under active bootstrapping. The testing standards and frameworks described below represent the verification targets mapped for implementation in Phase 1.

## Test Framework

**Runner & Assertion Engine:**
- **Vitest** - High-speed module testing runner integrated directly with Vite, offering outstanding ES module execution speed.
- Built-in `expect` assertions (e.g., `toBe`, `toEqual`, `toThrow`, `toBeNull`).

**Run Commands:**
```bash
npm run test                          # Run all test suites across the monorepo
npm run test:watch                    # Run tests in hot-watch mode for development
npm run test:coverage                 # Generate code-coverage reports via Vitest c8
```

---

## Test File Organization

**Location:**
- **Colocated Pattern:** Test suites are stored directly alongside their source modules rather than inside a remote, separate tree. This makes code modification and testing cycles extremely fast and tightly grouped.

**Naming Rules:**
- `*.test.ts` for logic components, services, database abstractions, and utils.
- `*.test.tsx` for React UI components (such as buttons, cards, or board columns).

**Example Structure:**
```
apps/
├── api/src/
│   ├── routes/
│   │   ├── notebooks.ts
│   │   └── notebooks.test.ts         # Endpoint integrations test
│   └── services/
│       ├── planner.ts
│       └── planner.test.ts           # Service logic test
└── web/src/
    ├── components/
    │   ├── KanbanCard.tsx
    │   └── KanbanCard.test.tsx       # Component visual/behavioral test
    └── hooks/
        ├── use-notebooks.ts
        └── use-notebooks.test.ts     # Hook state management test
```

---

## Test Structure

**Suite Layout (Arrange-Act-Assert):**
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { parseTopicResponse } from './parser';

describe('Parser Utilities', () => {
  describe('parseTopicResponse()', () => {
    it('should correctly parse formatted JSON strings', () => {
      // Arrange
      const rawJson = '[{"title": "Unit 1", "difficulty": 1}]';
      
      // Act
      const result = parseTopicResponse(rawJson);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Unit 1');
    });

    it('should throw validation error if schema fails Zod checks', () => {
      // Arrange
      const invalidJson = '[{"name": "Bad Schema"}]';

      // Act & Assert
      expect(() => parseTopicResponse(invalidJson)).toThrow();
    });
  });
});
```

---

## Mocking Strategy

**External API Boundaries:**
- Calls to the Groq API and Tavily search engine are highly transient, expensive, and rate-limited. They **must be mocked** in all local test suites.
- Use Vitest's `vi.mock()` at the top of test files to swap these service instances for local mock behaviors.

**Example Mocking Pattern:**
```typescript
import { vi } from 'vitest';
import { plannerService } from './planner';

// Stub the planner service module
vi.mock('./planner', () => ({
  plannerService: {
    generateTopics: vi.fn()
  }
}));

describe('Notebook Route', () => {
  it('triggers planning service successfully', async () => {
    const mockPlan = vi.mocked(plannerService.generateTopics);
    mockPlan.mockResolvedValue([
      { title: 'Learn Chess Basics', difficulty: 1 }
    ]);
    
    // Act & Assert follows...
  });
});
```

**What to Mock:**
- Network requests (using mock fetch configurations or dedicated MSW handlers).
- Groq AI SDK (`groq-sdk`) and Tavily API interactions.
- Neon Postgres live database connection (use Drizzle mock transaction drivers).

---

## Fixtures & Test Data

**Location & Reuse:**
- Simple test data can be defined inline inside the test file.
- Shared mock payloads (such as large mocked search responses or AI generated topics) should be isolated inside a local file: `apps/api/src/services/__mocks__/planner-fixtures.ts`.

---

## Coverage Specifications

**Requirements:**
- Core business layers (AI prompt parsing, database helpers, request checkers, and custom hooks) targeting a **minimum baseline of 80% line coverage**.
- Coverage tracked for PR approvals in CI pipelines.

---

*Testing analysis: 2026-05-26*
*Update when test patterns change*

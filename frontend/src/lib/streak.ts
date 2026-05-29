export interface StreakState {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  longestStreak: number;
}

export function getLocalDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getStreakState(): StreakState {
  const defaultState: StreakState = {
    currentStreak: 0,
    lastActiveDate: "",
    longestStreak: 0,
  };

  try {
    const raw = localStorage.getItem("inquisitive_streak");
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.currentStreak === "number" &&
      typeof parsed.lastActiveDate === "string" &&
      typeof parsed.longestStreak === "number"
    ) {
      return parsed as StreakState;
    }
    return defaultState;
  } catch (e) {
    console.error("Error reading streak from localStorage:", e);
    return defaultState;
  }
}

/**
 * Safely saves the given streak state to localStorage.
 */
export function setStreakState(state: StreakState): void {
  try {
    localStorage.setItem("inquisitive_streak", JSON.stringify(state));
  } catch (e) {
    console.error("Error saving streak to localStorage:", e);
  }
}

/**
 * Pure calculation to determine the updated streak state based on the current state
 * and today's local date string (YYYY-MM-DD).
 */
export function calculateStreakUpdate(
  currentState: StreakState,
  todayDateStr: string,
): StreakState {
  // If the user has never had an active date (first completion ever)
  if (!currentState.lastActiveDate || currentState.currentStreak === 0) {
    return {
      currentStreak: 1,
      lastActiveDate: todayDateStr,
      longestStreak: Math.max(currentState.longestStreak, 1),
    };
  }

  // Parse local dates by constructing them at midnight to avoid timezone shifts
  const lastActive = new Date(`${currentState.lastActiveDate}T00:00:00`);
  const today = new Date(`${todayDateStr}T00:00:00`);

  const diffTime = today.getTime() - lastActive.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Case 1: Active on the same day (no-op)
  if (diffDays === 0) {
    return currentState;
  }

  // Case 2: Consecutive day completion (increment streak)
  if (diffDays === 1) {
    const newStreak = currentState.currentStreak + 1;
    return {
      currentStreak: newStreak,
      lastActiveDate: todayDateStr,
      longestStreak: Math.max(currentState.longestStreak, newStreak),
    };
  }

  // Case 3: Clock went backward or invalid sequence (no-op to prevent degradation)
  if (diffDays < 0) {
    return currentState;
  }

  // Case 4: Missed a day or more (reset streak to 1)
  return {
    currentStreak: 1,
    lastActiveDate: todayDateStr,
    longestStreak: Math.max(currentState.longestStreak, 1),
  };
}

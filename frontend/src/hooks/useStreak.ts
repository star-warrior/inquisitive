import { create } from "zustand";
import { useEffect } from "react";
import {
  StreakState,
  calculateStreakUpdate,
  getStreakState,
  setStreakState,
  getLocalDateString,
} from "../lib/streak";

interface StreakStoreState {
  streak: StreakState;
  initialize: () => void;
  markActivity: () => void;
}

const useStreakStore = create<StreakStoreState>((set) => ({
  streak: { currentStreak: 0, lastActiveDate: "", longestStreak: 0 },
  initialize: () => {
    const initial = getStreakState();
    set({ streak: initial });
  },
  markActivity: () => {
    const current = getStreakState();
    const today = getLocalDateString();
    const updated = calculateStreakUpdate(current, today);

    // Only update if the streak properties actually changed
    if (
      updated.currentStreak !== current.currentStreak ||
      updated.lastActiveDate !== current.lastActiveDate ||
      updated.longestStreak !== current.longestStreak
    ) {
      setStreakState(updated);
      set({ streak: updated });
    }
  },
}));

export function useStreak() {
  const { streak, initialize, markActivity } = useStreakStore();

  // Load from localStorage on initial mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return { streak, markActivity };
}

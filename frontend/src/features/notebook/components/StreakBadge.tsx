import React from "react";
import { Flame } from "lucide-react";
import { useStreak } from "../../../hooks/useStreak";
import { cn } from "../../../lib/utils";

export default function StreakBadge() {
  const { streak } = useStreak();

  // If the user has no active streak, render absolutely nothing
  if (streak.currentStreak === 0) {
    return null;
  }

  return (
    <div className="relative group select-none">
      {/* Visual Badge Card */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-badge)] border border-[var(--color-warm-border)] bg-[var(--color-warm-input)] hover:bg-white hover:border-[var(--color-amber-mid)]/40 transition-all duration-300 font-sora shadow-xs cursor-help transform hover:-translate-y-0.5"
        )}
      >
        {/* Glowing/pulsing flame icon */}
        <div className="relative flex items-center justify-center">
          <Flame
            className={cn(
              "w-4 h-4 text-[var(--color-amber-deep)] fill-[var(--color-amber-deep)] animate-bounce"
            )}
            style={{ animationDuration: "2s" }}
          />
          {/* Flame ambient background glow */}
          <div className="absolute inset-0 bg-[var(--color-amber-light)]/20 blur-[6px] rounded-full scale-150 animate-pulse pointer-events-none" />
        </div>

        {/* Streak counts */}
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-extrabold text-[var(--bento-text-title)]">
            {streak.currentStreak}
          </span>
          <span className="text-[10px] text-[var(--bento-text-muted)] font-extrabold uppercase tracking-wider">
            {streak.currentStreak === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      {/* Sleek Warm Tooltip for Personal Best/Longest Streak */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 px-3 py-1.5 rounded-lg border border-[var(--color-warm-border)] bg-[var(--bento-card-bg)] text-xs text-[var(--bento-text-body)] shadow-md whitespace-nowrap opacity-0 pointer-events-none translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-50 font-sora font-bold flex items-center gap-1.5"
        )}
      >
        <Flame className="w-3.5 h-3.5 text-[var(--color-amber-deep)] fill-[var(--color-amber-deep)]" />
        <span>
          Personal Best:{" "}
          <strong className="text-[var(--color-amber-deep)]">
            {streak.longestStreak}
          </strong>{" "}
          {streak.longestStreak === 1 ? "day" : "days"}
        </span>
        {/* Tooltip caret */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[var(--color-warm-border)]" />
        <div className="absolute top-[calc(full-1px)] left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-[var(--bento-card-bg)]" />
      </div>
    </div>
  );
}

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="w-full flex items-center bg-white border border-[var(--notebook-border)]/60 rounded-[var(--radius-card)] p-[var(--spacing-card-p)] gap-3.5 animate-pulse shadow-sm select-none">
      {/* Left side: Thumbnail skeleton */}
      <div className="w-[76px] h-[76px] bg-[var(--notebook-bg)] rounded-[var(--radius-badge)] shrink-0" />

      {/* Right side: details skeleton */}
      <div className="flex-1 flex flex-col justify-between py-0.5 space-y-2.5 min-w-0">
        <div className="space-y-2">
          {/* Title line 1 & 2 */}
          <div className="h-3.5 w-5/6 bg-[var(--notebook-bg)] rounded-md" />
          <div className="h-3 w-1/2 bg-[var(--notebook-bg)] rounded-md" />
        </div>

        {/* Badges and action placeholders */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <div className="h-4.5 w-14 bg-[var(--notebook-bg)] rounded-md" />
            <div className="h-4.5 w-16 bg-[var(--notebook-bg)] rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-5 bg-[var(--notebook-bg)] rounded-md" />
            <div className="h-5 w-5 bg-[var(--notebook-bg)] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

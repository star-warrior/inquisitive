import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";
import { getOrCreateUUID } from "../../../lib/device";
import { Link } from "react-router-dom";
import { useStreak } from "../../../hooks/useStreak";

interface SidebarProps {
  activeTab: "search" | "notebooks";
  setActiveTab: (tab: "search" | "notebooks") => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  // Sidebar collapsible state (Desktop only)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Streak & gamification state from our custom hook
  const { streak } = useStreak();
  const streakCount = streak.currentStreak;

  return (
    <>
      {/* ========================================================= */}
      {/* DESKTOP SIDEBAR (Visible only on screens md and above)      */}
      {/* ========================================================= */}
      <aside
        className={cn(
          "hidden md:flex h-screen fixed left-0 top-0 border-r border-[var(--color-warm-border)] bg-[var(--color-warm-sidebar)] flex-col justify-between transition-all duration-300 z-50 shrink-0 select-none shadow-sm",
          isSidebarOpen ? "w-64" : "w-20",
        )}
      >
        {/* Sidebar Header */}
        <div>
          {isSidebarOpen ? (
            <div className="px-5 h-16 flex items-center justify-between border-b border-[var(--color-warm-border)]/60">
              <div className="flex items-center gap-2.5">
                <Link
                  to="/"
                  className="font-extrabold text-xl tracking-tight font-serif text-[var(--bento-text-title)]"
                >
                  Inquisitive
                </Link>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100/80 transition-colors border border-transparent hover:border-[var(--color-warm-border)]/40 active:scale-95"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-[var(--bento-text-muted)]" />
              </button>
            </div>
          ) : (
            <div className="h-16 flex flex-col items-center justify-center border-b border-[var(--color-warm-border)]/60 relative">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100/80 transition-colors border border-[var(--color-warm-border)]/40 active:scale-95 flex items-center justify-center"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4 text-[var(--bento-text-muted)]" />
              </button>
            </div>
          )}

          {/* Sidebar Menu / Tabs */}
          <nav className="px-3 py-6 space-y-1.5">
            {/* Create Tab */}
            <button
              onClick={() => setActiveTab("search")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold transition-all relative rounded-xl group",
                activeTab === "search"
                  ? "text-[var(--bento-text-title)]"
                  : "text-[var(--bento-text-muted)] hover:text-[var(--bento-text-title)]",
              )}
            >
              {activeTab === "search" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[var(--color-warm-card)] border border-[var(--color-warm-border)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 relative z-10 w-full">
                <Sparkles
                  className={cn(
                    "w-4 h-4 transition-colors",
                    activeTab === "search"
                      ? "text-[var(--bento-text-title)]"
                      : "text-[var(--bento-text-muted)] group-hover:text-[var(--bento-text-title)]",
                  )}
                />
                {isSidebarOpen && <span>Create</span>}
                {activeTab === "search" && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </div>
            </button>

            {/* Notebooks Tab */}
            <button
              onClick={() => setActiveTab("notebooks")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold transition-all relative rounded-xl group",
                activeTab === "notebooks"
                  ? "text-[var(--bento-text-title)]"
                  : "text-[var(--bento-text-muted)] hover:text-[var(--bento-text-title)]",
              )}
            >
              {activeTab === "notebooks" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[var(--color-warm-card)] border border-[var(--color-warm-border)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 relative z-10 w-full">
                <BookOpen
                  className={cn(
                    "w-4 h-4 transition-colors",
                    activeTab === "notebooks"
                      ? "text-[var(--bento-text-title)]"
                      : "text-[var(--bento-text-muted)] group-hover:text-[var(--bento-text-title)]",
                  )}
                />
                {isSidebarOpen && <span>My Notebooks</span>}
                {activeTab === "notebooks" && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--bento-text-title)] animate-pulse" />
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer (Streak & Profile) */}
        <div className="p-4 border-t border-[var(--color-warm-border)]/60 space-y-4">
          {/* Gamified Streak Meter */}
          <div
            className={cn(
              "bg-[var(--color-warm-input)]/40 border border-[var(--color-warm-border)] rounded-xl transition-all duration-300",
              isSidebarOpen
                ? "p-3 flex items-center justify-between"
                : "p-2.5 flex flex-col gap-3 items-center justify-center",
            )}
            title="Your Learning Streak"
          >
            <div className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform">
              <Flame
                className={cn(
                  "w-4 h-4 transition-all duration-300",
                  streakCount > 0
                    ? "text-[var(--color-amber-deep)] fill-[var(--color-amber-deep)] animate-bounce"
                    : "text-[var(--bento-text-muted)] fill-none"
                )}
                style={streakCount > 0 ? { animationDuration: "2.5s" } : undefined}
              />
              <span className="text-sm font-extrabold text-[var(--bento-text-title)]">
                {streakCount}
              </span>
              {isSidebarOpen && (
                <span className="text-sm text-[var(--bento-text-muted)] font-medium ml-0.5">
                  days Streak
                </span>
              )}
            </div>

            {isSidebarOpen && (
              <div className="h-4 w-px bg-[var(--color-warm-border)]" />
            )}
          </div>

          {/* User Profile Footer */}
          {isSidebarOpen ? (
            <div className="bg-[var(--color-warm-input)] border border-[var(--color-warm-border)] rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-white/60 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[var(--color-amber-deep)] text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-xs select-none">
                  A
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[var(--bento-text-title)] truncate">
                    Anonymous User
                  </h4>
                  <p className="text-sm text-[var(--bento-text-muted)] font-semibold mt-0.5">
                    Free Plan
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-full bg-[var(--color-amber-deep)] text-white font-extrabold flex items-center justify-center text-sm shadow-xs cursor-pointer hover:scale-105 transition-transform select-none">
                A
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM BAR (Visible only on screens below md)       */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex items-center justify-center gap-3 px-4">
        {/* Main Capsule Menu Pill */}
        <div className="bg-[var(--color-warm-sidebar)]/95 backdrop-blur-md border border-[var(--color-warm-border)] shadow-xl rounded-full px-5 py-2.5 flex items-center gap-6 select-none">
          {/* Create Tab Button */}
          <button
            onClick={() => setActiveTab("search")}
            className={cn(
              "relative p-2.5 rounded-full transition-all flex items-center justify-center active:scale-95 group",
              activeTab === "search"
                ? "text-[var(--bento-text-title)]"
                : "text-[var(--bento-text-muted)]",
            )}
          >
            {activeTab === "search" && (
              <motion.div
                layoutId="activeBottomTabPill"
                className="absolute inset-0 bg-[var(--color-warm-card)] border border-[var(--color-warm-border)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-full z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Sparkles className="w-5 h-5 relative z-10" />
          </button>

          {/* Notebooks Tab Button */}
          <button
            onClick={() => setActiveTab("notebooks")}
            className={cn(
              "relative p-2.5 rounded-full transition-all flex items-center justify-center active:scale-95 group",
              activeTab === "notebooks"
                ? "text-[var(--bento-text-title)]"
                : "text-[var(--bento-text-muted)]",
            )}
          >
            {activeTab === "notebooks" && (
              <motion.div
                layoutId="activeBottomTabPill"
                className="absolute inset-0 bg-[var(--color-warm-card)] border border-[var(--color-warm-border)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] rounded-full z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <BookOpen className="w-5 h-5 relative z-10" />
          </button>

          {/* Separator inside capsule */}
          <div className="h-4 w-px bg-[var(--color-warm-border)]" />

          {/* Interactive Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-warm-input)] border border-[var(--color-warm-border)]/60 rounded-full cursor-pointer active:scale-95 transition-all hover:bg-white/80"
            title="Your Daily Streak"
          >
            <Flame
              className={cn(
                "w-3.5 h-3.5 transition-all duration-300",
                streakCount > 0
                  ? "text-[var(--color-amber-deep)] fill-[var(--color-amber-deep)] animate-bounce"
                  : "text-[var(--bento-text-muted)] fill-none"
              )}
              style={streakCount > 0 ? { animationDuration: "2.5s" } : undefined}
            />
            <span className="text-xs font-bold text-[var(--bento-text-title)]">
              {streakCount}
            </span>
          </div>
        </div>

        {/* Floating User Profile Avatar J circle next to it */}
        <div
          className="w-12 h-12 rounded-full bg-[var(--color-amber-deep)] text-white font-extrabold flex items-center justify-center text-sm shadow-xl border border-[var(--color-warm-border)]/50 shrink-0 select-none active:scale-90 transition-transform"
          title="Jay Mehta (Free Plan)"
        >
          A
        </div>
      </div>
    </>
  );
}

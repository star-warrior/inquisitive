import React from "react";
import { Link } from "react-router-dom";
import { Notebook, Resource } from "../../../types";
import { BookOpen, Calendar, Hourglass, Layers } from "lucide-react";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";

interface NotebookCardProps {
  notebook: Notebook;
  resources: Resource[];
  onDelete: (id: string, e: React.MouseEvent) => void;
  index?: number;
}

export default function NotebookCard({
  notebook,
  resources,
  onDelete,
  index,
}: NotebookCardProps) {
  // Filter resources belonging to this notebook
  const notebookResources = resources.filter(
    (r) => r.notebookId === notebook.id,
  );
  const totalCount = notebookResources.length;

  const completedCount = notebookResources.filter(
    (r) => r.status === "completed",
  ).length;
  const skippedCount = notebookResources.filter(
    (r) => r.status === "skipped",
  ).length;

  // Use pre-computed database completion percentage
  const progressPercent = notebook.completionPercentage ?? 0;

  // Format created date
  const formattedDate = new Date(notebook.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const levelLabels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    hard: "Advanced",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, rotate: -3, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 16,
        mass: 1.1,
        delay: index !== undefined ? index * 0.08 : 0,
      }}
      className="w-full flex"
    >
      <Link
        to={`/notebook/${notebook.id}`}
        className="group block relative w-full bg-white border border-[var(--color-warm-border)]/60 rounded-[var(--radius-card)] p-[var(--spacing-page-p)] transition-all duration-300 hover:border-[var(--color-warm-border)] hover:shadow-xs hover:-translate-y-0.5 overflow-hidden font-sora"
      >
        <div className="absolute inset-0 bg-[var(--color-warm-input)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Card Header */}
        <div className="flex justify-between items-start gap-4 mb-3.5 relative z-10 font-sora">
          <h3 className="text-base font-bold tracking-tight text-[var(--bento-text-title)] transition-colors duration-300 line-clamp-2 leading-snug font-sora">
            {notebook.topic}
          </h3>
          <button
            onClick={(e) => onDelete(notebook.id, e)}
            className="text-[var(--bento-text-muted)] hover:text-rose-600 p-1.5 rounded-lg hover:bg-[var(--skipped-bg)] transition-all duration-300 invisible group-hover:visible opacity-0 group-hover:opacity-100"
            title="Delete Notebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>

        {/* Badges Row (Using exact monotone styles matching SearchSection) */}
        <div className="flex flex-wrap gap-1.5 mb-5 relative z-10 font-sora">
          <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-bold rounded-[var(--radius-badge)] border border-[var(--color-warm-border)] bg-[var(--color-warm-input)] text-[var(--bento-text-body)] font-sora shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
            {levelLabels[notebook.level]}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-bold rounded-[var(--radius-badge)] border border-[var(--color-warm-border)] bg-[var(--color-warm-input)] text-[var(--bento-text-body)] font-sora shadow-xs">
            <Hourglass className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
            {notebook.length.charAt(0).toUpperCase() + notebook.length.slice(1)}
          </span>
        </div>

        {/* Progress Section */}
        <div className="space-y-1.5 mb-5 relative z-10 font-sora">
          <div className="flex justify-between items-center text-sm font-sora font-bold">
            <span className="text-[var(--bento-text-body)]">Progress</span>
            <span
              className={cn(
                "font-bold font-sora text-sm",
                progressPercent > 0
                  ? "text-[var(--color-amber-deep)]"
                  : "text-[var(--bento-text-muted)]",
              )}
            >
              {progressPercent}%
            </span>
          </div>
          {/* Progress bar track */}
          <div className="w-full h-1.5 bg-[var(--color-warm-input)] border border-[var(--color-warm-border)]/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-amber-deep)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-[var(--color-warm-border)]/50 text-sm text-[var(--bento-text-muted)] font-sora font-bold relative z-10">
          <Calendar className="w-3.5 h-3.5 opacity-80" />
          <span>Created {formattedDate}</span>
        </div>
      </Link>
    </motion.div>
  );
}

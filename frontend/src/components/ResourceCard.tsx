import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resource } from "../types";
import { ExternalLink, Film, FileText, Star, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: string) => void;
  isOverlay?: boolean;
  index?: number;
}

export default function ResourceCard({ resource, onDelete, isOverlay = false, index }: ResourceCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: resource.id });

  const style: React.CSSProperties = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {};

  const difficultyNum = parseInt(resource.difficulty) || 1;

  // Format type label
  const isVideo = resource.sourceType === "video";

  // Format creation date beautifully like "June 19, 2025"
  const dateStr = resource.createdAt
    ? new Date(resource.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "June 19, 2025";

  // Dynamic tags matching the pastel tag style in the mockup
  const sourceTagText = isVideo ? "Learning" : "Explore and research";
  const sourceTagClass = isVideo
    ? "bg-emerald-50 text-emerald-700 border-emerald-100/50"
    : "bg-sky-50 text-sky-700 border-sky-100/50";

  let difficultyTagText = "Core Learning";
  let difficultyTagClass = "bg-slate-50 text-slate-600 border-slate-100";
  if (difficultyNum >= 4) {
    difficultyTagText = "Advanced Study";
    difficultyTagClass = "bg-purple-50 text-purple-700 border-purple-100/50";
  } else if (difficultyNum <= 2) {
    difficultyTagText = "Foundation";
    difficultyTagClass = "bg-amber-50 text-amber-700 border-amber-100/50";
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full flex items-stretch bg-white border rounded-[var(--radius-card)] overflow-hidden shadow-sm group/card transition-all cursor-grab active:cursor-grabbing p-[var(--spacing-card-p)] gap-3.5 select-none",
        isDragging
          ? "opacity-30 border-indigo-500/50 shadow-md"
          : "border-[var(--notebook-border)]/60 hover:border-[var(--notebook-border)] hover:shadow-md",
        isOverlay
          ? "border-indigo-500 bg-white shadow-lg ring-2 ring-indigo-500/10 cursor-grabbing scale-[1.01]"
          : ""
      )}
      initial={isOverlay ? false : { opacity: 0, y: -45, rotate: -4, scale: 0.93 }}
      animate={isOverlay ? {} : { opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={isOverlay ? undefined : {
        type: "spring",
        stiffness: 120,
        damping: 14,
        delay: index !== undefined ? index * 0.12 : 0,
      }}
      {...attributes}
      {...listeners}
    >
      {/* Small Left-Side Thumbnail or Icon Placeholder */}
      <div className="w-[76px] h-[76px] shrink-0 rounded-[var(--radius-badge)] overflow-hidden bg-[var(--notebook-bg)] flex items-center justify-center border border-[var(--notebook-border)]/40 shadow-inner relative select-none">
        {resource.thumbNail ? (
          <img
            src={resource.thumbNail}
            alt={resource.title}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 select-none"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center transition-colors",
              isVideo ? "bg-indigo-50/50" : "bg-amber-50/50"
            )}
          >
            {isVideo ? (
              <Film className="w-5 h-5 text-indigo-500/70" />
            ) : (
              <FileText className="w-5 h-5 text-amber-600/70" />
            )}
          </div>
        )}
      </div>

      {/* Right Side Content (Title, Date, Badges, Actions) */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="space-y-1">
          {/* Card Title */}
          <h4 className="font-extrabold text-[13px] text-[var(--notebook-text-primary)] line-clamp-2 leading-snug tracking-tight font-sora group-hover/card:text-[var(--brand-primary)] transition-colors select-none">
            {resource.title}
          </h4>

          {/* Formatted Date */}
          <div className="text-[10px] text-[var(--notebook-text-muted)] font-sora font-semibold select-none">
            {dateStr}
          </div>
        </div>

        {/* Dynamic Pastel Tag Pills & Star Rating */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5">
          <div className="flex flex-wrap gap-1">
            <span
              className={cn(
                "text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wide border font-sora shadow-sm",
                sourceTagClass
              )}
            >
              {sourceTagText}
            </span>
            {difficultyTagText && (
              <span
                className={cn(
                  "text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wide border font-sora shadow-sm",
                  difficultyTagClass
                )}
              >
                {difficultyTagText}
              </span>
            )}
          </div>

          {/* Action Buttons (External link and Delete) */}
          <div className="flex items-center gap-2 relative z-20">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Critical: Prevents drag triggering on link click
              className="text-[var(--notebook-text-muted)] hover:text-[var(--brand-primary)] p-1 rounded-lg hover:bg-[var(--notebook-bg)] transition-colors"
              title="Visit Resource"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Critical: Prevents drag triggering on delete click
                onDelete(resource.id);
              }}
              className="text-[var(--notebook-text-muted)] hover:text-rose-600 p-1 rounded-lg hover:bg-[var(--skipped-bg)] transition-colors"
              title="Delete Resource"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

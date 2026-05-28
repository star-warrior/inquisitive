import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Resource } from "../types";
import ResourceCard from "./ResourceCard";
import SkeletonCard from "./SkeletonCard";
import { cn } from "../lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";

interface KanbanColumnProps {
  id: Resource["status"];
  title: string;
  resources: Resource[];
  onDeleteResource: (id: string) => void;
  isLoading: boolean;
  startIndex: number;
}

export default function KanbanColumn({
  id,
  title,
  resources,
  onDeleteResource,
  isLoading,
  startIndex,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Unique styling per column using our centralized css variables
  const statusConfig = {
    todo: {
      containerBg: "bg-[var(--todo-bg)]",
      borderColor: "border-[var(--todo-border)]",
      activeBg: "bg-[var(--todo-badge-bg)]/40",
      badgeColor:
        "bg-[var(--todo-badge-bg)] text-[var(--todo-badge-text)] border-[var(--todo-border)]/50",
      countColor: "text-[var(--todo-badge-text)]",
      btnColor:
        "text-[var(--todo-badge-text)] border-[var(--todo-border)]/60 hover:bg-[var(--todo-badge-bg)]",
      accentDot: "bg-[var(--todo-accent)]",
    },
    in_progress: {
      containerBg: "bg-[var(--progress-bg)]",
      borderColor: "border-[var(--progress-border)]",
      activeBg: "bg-[var(--progress-badge-bg)]/40",
      badgeColor:
        "bg-[var(--progress-badge-bg)] text-[var(--progress-badge-text)] border-[var(--progress-border)]/50",
      countColor: "text-[var(--progress-badge-text)]",
      btnColor:
        "text-[var(--progress-badge-text)] border-[var(--progress-border)]/60 hover:bg-[var(--progress-badge-bg)]",
      accentDot: "bg-[var(--progress-accent)] animate-pulse",
    },
    completed: {
      containerBg: "bg-[var(--completed-bg)]",
      borderColor: "border-[var(--completed-border)]",
      activeBg: "bg-[var(--completed-badge-bg)]/40",
      badgeColor:
        "bg-[var(--completed-badge-bg)] text-[var(--completed-badge-text)] border-[var(--completed-border)]/50",
      countColor: "text-[var(--completed-badge-text)]",
      btnColor:
        "text-[var(--completed-badge-text)] border-[var(--completed-border)]/60 hover:bg-[var(--completed-badge-bg)]",
      accentDot: "bg-[var(--completed-accent)]",
    },
    skipped: {
      containerBg: "bg-[var(--skipped-bg)]",
      borderColor: "border-[var(--skipped-border)]",
      activeBg: "bg-[var(--skipped-badge-bg)]/40",
      badgeColor:
        "bg-[var(--skipped-badge-bg)] text-[var(--skipped-badge-text)] border-[var(--skipped-border)]/50",
      countColor: "text-[var(--skipped-badge-text)]",
      btnColor:
        "text-[var(--skipped-badge-text)] border-[var(--skipped-border)]/60 hover:bg-[var(--skipped-badge-bg)]",
      accentDot: "bg-[var(--skipped-accent)]",
    },
  };

  const config = statusConfig[id];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-full h-fit rounded-[var(--radius-column)] border transition-colors transition-shadow duration-300 overflow-hidden shadow-sm",
        config.containerBg,
        config.borderColor,
        isOver
          ? "shadow-md ring-2 ring-indigo-500/10 border-indigo-500/30"
          : "",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-[var(--spacing-column-p)] py-4 bg-transparent border-b border-black/[0.03]">
        <div className="flex items-center gap-3">
          {/* Badge styled title (e.g. Todo, In Progress, Done) */}
          <span
            className={cn(
              "text-xs px-3 py-1 rounded-[var(--radius-progress)] font-bold tracking-wide border font-sora shadow-sm",
              config.badgeColor,
            )}
          >
            {title}
          </span>
          <span
            className={cn(
              "text-sm font-extrabold font-sora",
              config.countColor,
            )}
          >
            {resources.length}
          </span>
        </div>
      </div>

      {/* Column Body / Draggable List */}
      <div className="p-[var(--spacing-card-p)] space-y-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <SortableContext
            items={resources.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            {resources.length > 0 ? (
              resources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDelete={onDeleteResource}
                  index={startIndex + index}
                />
              ))
            ) : (
              // Empty Column Placeholder
              <div
                className={cn(
                  "flex flex-col items-center justify-center h-48 border border-dashed rounded-[var(--radius-card)] p-4 text-center transition-colors duration-300",
                  isOver
                    ? "border-indigo-500/30 bg-indigo-500/5 text-indigo-500"
                    : "border-[var(--notebook-border)] text-[var(--notebook-text-muted)]",
                )}
              >
                <p className="text-xs font-semibold font-sora">
                  No resources here
                </p>
                <p className="text-[10px] opacity-75 mt-1 font-light">
                  Drag items here to reorder
                </p>
              </div>
            )}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

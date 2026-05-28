import React from "react";
import NotebookCard from "./NotebookCard";
import { BookOpen, Search } from "lucide-react";
import { Notebook, Resource } from "../types";

interface NotebooksSectionProps {
  notebooks: Notebook[];
  resources: Resource[];
  onDelete: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function NotebooksSection({
  notebooks,
  resources,
  onDelete,
  searchQuery,
  setSearchQuery,
}: NotebooksSectionProps) {
  // Filter notebooks based on search
  const filteredNotebooks = notebooks.filter((n) =>
    n.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto w-full pt-4 pb-12 space-y-6 flex-1 font-sora">
      {/* Minimalist Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-warm-border)]">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold font-serif italic text-[var(--bento-text-title)] flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[var(--bento-text-title)]" />
            Your Study Notebooks
          </h2>
          <p className="text-xs md:text-sm text-[var(--bento-text-muted)] font-sora font-medium">
            Track, filter, and master active interactive roadmaps.
          </p>
        </div>

        {/* Compact Search bar */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--bento-text-muted)]" />
          <input
            type="text"
            placeholder="Search notebooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[var(--color-warm-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--bento-text-title)] placeholder-[var(--bento-text-muted)] focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-100 transition-all font-semibold font-sora"
          />
        </div>
      </div>

      {/* Notebook Grid */}
      {filteredNotebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotebooks.map((notebook, index) => (
            <NotebookCard
              key={notebook.id}
              notebook={notebook}
              resources={resources}
              onDelete={onDelete}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[var(--color-warm-border)] rounded-[var(--radius-card)] text-center p-6 bg-white/40 font-sora">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[var(--color-warm-border)] text-[var(--bento-text-muted)] mb-3 shadow-sm">
            <BookOpen className="w-5 h-5 text-[var(--color-amber-mid)]" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--bento-text-title)] font-sora">
            No roadmaps found
          </h3>
          <p className="text-[var(--bento-text-muted)] text-sm mt-1 max-w-xs font-semibold leading-relaxed font-sora">
            {searchQuery
              ? "No matches fit your search criteria. Try a different query."
              : "Generate your first interactive AI notebook to get started on your curated learning path."}
          </p>
        </div>
      )}
    </div>
  );
}

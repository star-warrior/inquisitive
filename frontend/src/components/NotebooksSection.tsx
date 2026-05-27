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
    <div className="max-w-5xl mx-auto w-full pt-4 pb-12 space-y-6 flex-1 font-neoris">
      {/* Minimalist Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--notebook-border)]">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold font-serif italic text-[var(--notebook-text-primary)] flex items-center gap-2 font-medium font-neoris">
            <BookOpen className="w-4.5 h-4.5 text-[var(--notebook-text-primary)]" />
            Your Study Notebooks
          </h2>
          <p className="text-[11px] text-[var(--notebook-text-muted)] font-neoris">
            Track, filter, and master active interactive roadmaps.
          </p>
        </div>

        {/* Compact Search bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--notebook-text-muted)]" />
          <input
            type="text"
            placeholder="Search notebooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[var(--notebook-border)] rounded-[var(--radius-button)] pl-9 pr-4 py-1.5 text-xs text-[var(--notebook-text-primary)] placeholder-[var(--notebook-text-muted)] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all font-semibold font-neoris"
          />
        </div>
      </div>

      {/* Notebook Grid */}
      {filteredNotebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotebooks.map((notebook) => (
            <NotebookCard
              key={notebook.id}
              notebook={notebook}
              resources={resources}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[var(--notebook-border)] rounded-[var(--radius-card)] text-center p-6 bg-white/40 font-neoris">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[var(--notebook-border)] text-[var(--notebook-text-muted)] mb-3 shadow-sm">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--notebook-text-primary)] font-neoris">
            No roadmaps found
          </h3>
          <p className="text-[var(--notebook-text-muted)] text-[11px] mt-1 max-w-xs font-semibold leading-relaxed font-neoris">
            {searchQuery
              ? "No matches fit your search criteria. Try a different query."
              : "Generate your first interactive AI notebook to get started on your curated learning path."}
          </p>
        </div>
      )}
    </div>
  );
}

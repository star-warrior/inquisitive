import React, { useState, useEffect } from "react";
import { useKanbanStore } from "../stores/kanbanStore";
import SearchSection from "../components/SearchSection";
import NotebooksSection from "../components/NotebooksSection";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const { notebooks, resources, addNotebook, deleteNotebook, fetchNotebooks } = useKanbanStore();

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  // Form State
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "hard">("beginner");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSubmitting(true);
    try {
      await addNotebook(topic.trim(), level, length);
      setTopic("");
      setLevel("beginner");
      setLength("medium");
    } catch (err) {
      console.error("Error creating notebook:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotebook = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigation through the Link wrapper
    if (confirm("Are you sure you want to delete this notebook and all its resources?")) {
      deleteNotebook(id);
    }
  };

  return (
    <div className="min-h-screen editorial-grid text-[var(--notebook-text-primary)] selection:bg-indigo-500/10 font-sans relative flex flex-col">
      {/* Editorial Navbar (Uses instrument Sans - font-sans) */}
      <header className="border-b border-[var(--notebook-border)] bg-[#FAF9F6]/60 backdrop-blur-md sticky top-0 z-40 font-sans">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2.5 font-sans">
            {/* Monotonous Brand Box */}
            <div className="w-7 h-7 rounded-[var(--radius-button)] bg-[var(--notebook-text-primary)] flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight font-sans text-[var(--notebook-text-primary)]">
              Inquisitive
            </span>
            <span className="text-[9px] text-[var(--notebook-text-secondary)] font-semibold uppercase tracking-wider ml-1 px-2 py-0.5 rounded-[var(--radius-button)] border border-[var(--notebook-border)] bg-white font-sans">
              AI Planner
            </span>
          </div>
          <div className="flex items-center gap-4 font-sans">
            <span className="text-[10px] text-[var(--notebook-text-muted)] font-mono tracking-tight font-medium bg-white border border-[var(--notebook-border)] px-3 py-1 rounded-[var(--radius-button)] shadow-2xs">
              AVOID OVERLOAD
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area (Uses neoris style - font-neoris) */}
      <main className="max-w-7xl mx-auto px-6 py-4 flex-1 flex flex-col justify-between space-y-6 font-neoris w-full">
        {/* Search / Plan Prompt Section Component */}
        <SearchSection
          topic={topic}
          setTopic={setTopic}
          level={level}
          setLevel={setLevel}
          length={length}
          setLength={setLength}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateNotebook}
        />

        {/* Notebook Listing Section Component */}
        <NotebooksSection
          notebooks={notebooks}
          resources={resources}
          onDelete={handleDeleteNotebook}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>
    </div>
  );
}

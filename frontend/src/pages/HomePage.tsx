import React, { useState, useEffect } from "react";
import { useKanbanStore } from "../stores/kanbanStore";
import SearchSection from "../components/SearchSection";
import NotebooksSection from "../components/NotebooksSection";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const { notebooks, resources, addNotebook, deleteNotebook, fetchNotebooks } = useKanbanStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  // Tab control state: "search" | "notebooks"
  const [activeTab, setActiveTab] = useState<"search" | "notebooks">("search");

  // Form State
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "hard">("beginner");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const newNotebook = await addNotebook(topic.trim(), level, length);
      setTopic("");
      setLevel("beginner");
      setLength("medium");
      
      // Directly navigate to the newly created Notebook page!
      if (newNotebook && newNotebook.id) {
        navigate(`/notebook/${newNotebook.id}`);
      }
    } catch (err: any) {
      console.error("Error creating notebook:", err);
      setError(err.message || "Failed to create notebook via AI orchestrator.");
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
    <div className="min-h-screen bg-bento-warm text-[var(--notebook-text-primary)] selection:bg-indigo-500/10 font-sora flex relative overflow-hidden">
      {isSubmitting && <LoadingScreen />}

      {/* Background glowing gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-indigo-500/[0.02] rounded-full blur-[140px] pointer-events-none" />
      
      {/* Editorial Grid pattern */}
      <div className="absolute inset-0 editorial-grid opacity-100 pointer-events-none" />

      {/* Sidebar Component */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar flex flex-col py-8 px-6 md:px-12 md:pl-28 relative z-10">
        <div className="max-w-5xl mx-auto w-full space-y-6 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === "search" ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="my-auto py-8 w-full flex-1 flex flex-col justify-center"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto w-full mb-6 p-4 rounded-2xl bg-rose-50/80 backdrop-blur-md border border-rose-100/80 flex items-start gap-3 shadow-xs text-rose-800 relative animate-drop-in"
                  >
                    <div className="p-1.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1 flex flex-col justify-center">
                      <h4 className="font-extrabold text-[12px] font-sora leading-tight">Roadmap Creation Failed</h4>
                      <p className="text-[11px] font-medium leading-relaxed font-sora text-rose-700/90">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-rose-400 hover:text-rose-600 text-xs font-bold px-2 py-1 rounded-md transition-colors font-sora shrink-0 align-self-start"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}

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
              </motion.div>
            ) : (
              <motion.div
                key="notebooks"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full py-4"
              >
                <NotebooksSection
                  notebooks={notebooks}
                  resources={resources}
                  onDelete={handleDeleteNotebook}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

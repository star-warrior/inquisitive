import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useKanbanStore } from "../stores/kanbanStore";
import KanbanBoard from "../components/KanbanBoard";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Hourglass,
  Plus,
  Sparkles,
  AlertCircle,
  FileText,
  Film,
  Star,
} from "lucide-react";
import { cn } from "../lib/utils";
import LoadingScreen from "../components/LoadingScreen";

export default function NotebookPage() {
  // Extract notebook ID from route params (handles both /notebook/:notebookId and /notebooks/:id)
  const { notebookId, id } = useParams<{ notebookId?: string; id?: string }>();
  const activeNotebookId = notebookId || id;
  const navigate = useNavigate();

  const { notebooks, resources, addResource, fetchResources, fetchNotebooks } =
    useKanbanStore();

  // Find target notebook
  const notebook = notebooks.find((n) => n.id === activeNotebookId);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for manual resource addition
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resSourceType, setResSourceType] = useState<"article" | "video">(
    "article",
  );
  const [resDifficulty, setResDifficulty] = useState<
    "1" | "2" | "3" | "4" | "5"
  >("3");

  // Show skeletons or loading screen until the data is fully fetched from the API
  useEffect(() => {
    let isMounted = true;
    const initPage = async () => {
      setIsLoading(true);
      try {
        if (notebooks.length === 0) {
          await fetchNotebooks();
        }
        if (activeNotebookId) {
          await fetchResources(activeNotebookId);
        }
      } catch (err) {
        console.error("Failed to load notebook page:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initPage();
    return () => {
      isMounted = false;
    };
  }, [activeNotebookId, fetchNotebooks, fetchResources]);

  // If we are currently loading notebooks/resources and the active notebook is not yet resolved, show a clean loading screen
  if (isLoading && !notebook) {
    return <LoadingScreen />;
  }

  // If the notebook remains undefined after loading has finished, render the actual "not found" page
  if (!notebook) {
    return (
      <div className="min-h-screen bg-bento-warm text-slate-800 flex flex-col items-center justify-center p-6 text-center editorial-grid">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100 mb-6 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-slate-900">
          Notebook Not Found
        </h2>
        <p className="text-slate-500 text-xs mt-2 max-w-sm font-light font-sora">
          The learning plan you are looking for does not exist or has been
          deleted.
        </p>
        <Link
          to="/"
          className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-sm font-sora"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

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

  // Compute progress: Completed / (Total - Skipped)
  const validTotal = totalCount - skippedCount;
  const progressPercent = notebook.completionPercentage ?? 0;

  // Add Resource submit trigger
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim()) return;

    setIsAddingResource(true);
    // Simulate async operation for a premium feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    addResource(
      notebook.id,
      resTitle.trim(),
      resUrl.trim(),
      resSourceType,
      resDifficulty,
    );

    // Reset Form
    setResTitle("");
    setResUrl("");
    setResSourceType("article");
    setResDifficulty("3");
    setShowAddForm(false);
    setIsAddingResource(false);
  };

  const levelLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    hard: "Advanced",
  };

  const levelBadgeStyles = {
    beginner: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
    intermediate: "bg-amber-50 text-amber-700 border-amber-100/80",
    hard: "bg-rose-50 text-rose-700 border-rose-100/80",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen editorial-grid text-[var(--notebook-text-primary)] selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden"
    >
      {/* Background glowing gradients (beautifully muted on light background) */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <motion.header
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="border-b border-[var(--notebook-border)] bg-[var(--notebook-header-bg)] backdrop-blur-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/app"
            className="flex items-center gap-2 text-base text-[var(--notebook-text-secondary)] hover:text-[var(--notebook-text-primary)] transition-colors font-serif font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Back to Roadmaps</span>
          </Link>
          <div className="flex items-center gap-2"></div>
        </div>
      </motion.header>

      <motion.main
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.1,
          duration: 0.6,
          type: "spring",
          stiffness: 85,
          damping: 14,
        }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8"
      >
        {/* Top Info Section & Progress */}
        <div className="bg-white/80 backdrop-blur-md border border-[var(--notebook-border)] rounded-[var(--radius-column)] p-[var(--spacing-page-p)] md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center shadow-sm animate-drop-in">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--notebook-text-primary)] leading-tight font-serif">
              {notebook.topic}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2.5">
              <span className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-[var(--radius-badge)] border border-[var(--notebook-border)] bg-white shadow-sm font-sora">
                <Layers className="w-4 h-4 text-[var(--notebook-text-primary)]" />
                <span className="text-[var(--badge-text-secondary)]">
                  {levelLabels[notebook.level]}
                </span>
              </span>
              <span className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-[var(--radius-badge)] border border-[var(--notebook-border)] bg-white shadow-sm font-sora">
                <Hourglass className="w-4 h-4 text-[var(--notebook-text-primary)]" />
                <span className="text-[var(--badge-text-secondary)]">
                  {notebook.length.charAt(0).toUpperCase() +
                    notebook.length.slice(1)}{" "}
                  Size
                </span>
              </span>
              <span className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-[var(--radius-badge)] border border-[var(--notebook-border)] bg-white shadow-sm font-sora">
                <BookOpen className="w-4 h-4 text-[var(--notebook-text-primary)]" />
                <span className="text-[var(--badge-text-secondary)]">
                  {totalCount} total resources
                </span>
              </span>
            </div>
          </div>

          {/* Dynamic Progress indicator */}
          <div className="w-full md:w-80 space-y-3 bg-white/90 border border-[var(--notebook-border)] p-[var(--spacing-column-p)] rounded-[var(--radius-card)] shadow-sm">
            <div className="flex justify-between items-center text-xs font-sora font-semibold text-[var(--notebook-text-secondary)]">
              <span>Learning Progress</span>
              <span className="text-[var(--brand-primary)] font-extrabold text-sm">
                {progressPercent}%
              </span>
            </div>
            {/* Progress track */}
            <div className="w-full h-2.5 bg-[var(--notebook-bg)] rounded-full overflow-hidden border border-[var(--notebook-border)]/40">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--notebook-text-muted)] font-sora font-medium">
              <span>
                {completedCount} of {validTotal} Completed
              </span>
              {skippedCount > 0 && (
                <span className="text-[var(--todo-badge-text)]">
                  {skippedCount} Skipped
                </span>
              )}
            </div>
          </div>
        </div>

        {/* The 4-column Drag Kanban Board! */}
        <KanbanBoard notebook={notebook} isLoading={isLoading} />
      </motion.main>
    </motion.div>
  );
}

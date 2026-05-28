import React, { useState, useEffect } from "react";
import { Sparkles, Compass } from "lucide-react";

const LOADING_STATUSES = [
  "Analyzing your query and mapping learning objectives...",
  "Structuring sequential academic pillars & progress stages...",
  "Scanning indices for highly-rated video guides...",
  "Filtering tutorial documentation & articles...",
  "Grading resource difficulty levels and material length...",
  "Crating foundation and enrichment cards...",
  "Arranging your Kanban learning lane boards...",
  "Finalizing your interactive Inquisitive Notebook..."
];

export default function LoadingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through realistic status updates
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2800);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);

    return () => {
      clearInterval(statusInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bento-warm text-[var(--notebook-text-primary)] font-sora select-none overflow-hidden">
      {/* Editorial Grid pattern */}
      <div className="absolute inset-0 editorial-grid opacity-100 pointer-events-none" />

      {/* Abstract Glowing Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/[0.04] rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-12 relative z-10">
        
        {/* Animated Concentric Pulsing Ring Loader */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Inner Pulsing Core */}
          <div className="absolute w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-md">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>
          
          {/* Middle Spinning Ring */}
          <div className="absolute w-20 h-20 rounded-full border border-dashed border-indigo-300 animate-spin" style={{ animationDuration: '8s' }} />

          {/* Outer Smooth Rotating Double Ring with gradient gradient */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-transparent border-t-indigo-600/40 border-b-emerald-500/40 animate-spin" style={{ animationDuration: '2.5s' }} />
          
          {/* Glowing Aura backplate */}
          <div className="absolute w-28 h-28 rounded-full bg-indigo-500/5 filter blur-xl animate-pulse" />
        </div>

        {/* Informative Text Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--notebook-text-primary)] tracking-tight">
            Curating Learning Roadmap
          </h2>
          
          {/* Carousel Status Update Banner */}
          <div className="h-16 flex items-center justify-center px-4">
            <p className="text-sm font-medium text-[var(--notebook-text-secondary)] italic leading-relaxed transition-all duration-500 animate-drop-in">
              {LOADING_STATUSES[statusIndex]}{dots}
            </p>
          </div>
        </div>

        {/* Small aesthetic indicator */}
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-[var(--notebook-text-muted)] font-extrabold uppercase bg-white border border-[var(--notebook-border)]/50 rounded-full px-3 py-1.5 shadow-xs">
          <Compass className="w-3 h-3 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Inquisitive AI Planner v1.0</span>
        </div>
      </div>
    </div>
  );
}

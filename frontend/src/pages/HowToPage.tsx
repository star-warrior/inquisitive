import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Trophy,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Compass,
} from "lucide-react";
import boostImg from "../assets/images/bento-images/boost.png";

export default function HowToPage() {
  const steps = [
    {
      num: "01",
      title: "Synthesize the Roadmap",
      subtitle: "AI-Powered Curriculum",
      description:
        "Input any topic you wish to master—from 'Quantum Computing' to 'Sourdough Baking'. Select your target experience tier (Beginner, Intermediate, Advanced) and study plan size (Short, Medium, Long). Inquisitive's AI agent analyzes the topic and instantly designs a structured learning path.",
      icon: Sparkles,
      colorClass:
        "bg-[var(--todo-badge-bg)] text-[var(--todo-badge-text)] border-[var(--todo-border)]/50",
      iconColor: "text-[var(--todo-accent)]",
    },
    {
      num: "02",
      title: "Visualize Your Board",
      subtitle: "Drag & Drop Kanban",
      description:
        "Your roadmap is automatically organized into a beautiful four-stage visual board. Track your assets through To Do, In Progress, Completed, or Skipped lanes. Simply drag and drop resources as you study to organize your daily routine.",
      icon: Layers,
      colorClass:
        "bg-[var(--progress-badge-bg)] text-[var(--progress-badge-text)] border-[var(--progress-border)]/50",
      iconColor: "text-[var(--progress-accent)]",
    },
    {
      num: "03",
      title: "Calibrate Progress",
      subtitle: "Dynamic Percentage",
      description:
        "Inquisitive recalculates your roadmap's completion score as you progress. Already know a specific concept? Drag it to 'Skipped'—the system adjusts your active study metrics instantly, preventing information overload.",
      icon: Trophy,
      colorClass:
        "bg-[var(--completed-badge-bg)] text-[var(--completed-badge-text)] border-[var(--completed-border)]/50",
      iconColor: "text-[var(--completed-accent)]",
    },
    {
      num: "04",
      title: "Achieve Your Goals",
      subtitle: "Personal Success",
      description:
        "Stay motivated and reach your target learning milestones. Track your long-term skill acquisition, complete customized courses at your own pace, and unlock new heights of expertise through structured generative learning paths.",
      icon: Trophy,
      colorClass:
        "bg-[var(--completed-badge-bg)] text-[var(--completed-badge-text)] border-[var(--completed-border)]/50",
      iconColor: "text-[var(--completed-accent)]",
    },
  ];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const renderStepVisual = (num: string) => {
    switch (num) {
      case "01":
        return (
          <div className="w-full h-48 bg-[#F4F4F6] border border-[#E6E6EB] rounded-[20px] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dotted grid effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#C87930_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            
            <div className="w-full max-w-[260px] bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative z-10 flex flex-col gap-3">
              {/* Search field */}
              <div className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-xl px-3 py-2.5 text-[10px] font-sora font-semibold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-amber-deep)] animate-pulse" />
                  <span>Quantum Physics</span>
                </div>
                <span className="text-[var(--color-amber-deep)] font-light animate-pulse">|</span>
              </div>
              {/* Config pills */}
              <div className="flex justify-between items-center text-[9px] font-sora font-bold">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100/60">
                  Intermediate
                </span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100/60">
                  Medium Size
                </span>
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                  <span>Synthesize</span>
                  <ArrowRight className="w-2 h-2 text-[#F5A84A]" />
                </span>
              </div>
            </div>
          </div>
        );
      case "02":
        return (
          <div className="w-full h-48 bg-[#F4F4F6] border border-[#E6E6EB] rounded-[20px] flex items-center justify-center p-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#E8E4DC_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-25 pointer-events-none" />
            
            <div className="flex gap-2.5 w-full max-w-[320px] relative z-10">
              {/* Column To Do */}
              <div className="flex-1 bg-[#fcf8f5]/80 border border-[#f3e1d3]/80 rounded-xl p-2 flex flex-col gap-2">
                <span className="text-[8px] font-sora font-extrabold uppercase text-[#a05e2b] tracking-wider border-b border-black/[0.03] pb-1">
                  To Do
                </span>
                {/* Ghost Card (Dotted Outline) */}
                <div className="h-11 border border-dashed border-slate-300 rounded-lg bg-slate-100/40 flex items-center justify-center">
                  <span className="text-[7px] text-slate-400 italic">Moving...</span>
                </div>
              </div>
              
              {/* Column In Progress */}
              <div className="flex-1 bg-[#fffbf0]/80 border border-[#faebd7]/80 rounded-xl p-2 flex flex-col gap-2">
                <span className="text-[8px] font-sora font-extrabold uppercase text-[#b45309] tracking-wider border-b border-black/[0.03] pb-1">
                  In Progress
                </span>
                {/* Superposition Card (Active dragging/dropping) */}
                <div className="h-11 bg-white border border-indigo-200 shadow-[0_4px_12px_rgba(99,102,241,0.06)] rounded-lg p-1.5 flex flex-col justify-center relative transform -rotate-1 translate-y-0.5">
                  <span className="text-[9px] font-sora font-extrabold text-slate-800 leading-none">
                    Superposition
                  </span>
                  <span className="text-[7px] text-slate-400 font-light truncate mt-0.5">
                    12 min video
                  </span>
                </div>
              </div>

              {/* Column Completed */}
              <div className="flex-1 bg-[#f0fdf4]/80 border border-[#d1efe0]/80 rounded-xl p-2 flex flex-col gap-2">
                <span className="text-[8px] font-sora font-extrabold uppercase text-[#065f46] tracking-wider border-b border-black/[0.03] pb-1">
                  Completed
                </span>
                <div className="h-11 bg-white/60 border border-slate-100 rounded-lg p-1.5 flex items-center justify-between opacity-70">
                  <span className="text-[8px] font-sora font-semibold text-slate-500 line-through truncate">
                    Intro Qubits
                  </span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[6px] font-bold shrink-0">✓</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "03":
        return (
          <div className="w-full h-48 bg-[#F4F4F6] border border-[#E6E6EB] rounded-[20px] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#C87930_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            
            <div className="w-full max-w-[260px] bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative z-10 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[8px] font-sora font-bold text-slate-400 tracking-widest">
                    METRICS
                  </span>
                  <span className="text-xs font-bold font-serif text-slate-800 leading-tight truncate max-w-[120px]">
                    Superconductivity
                  </span>
                </div>
                <span className="text-xs font-extrabold font-serif text-indigo-600 bg-indigo-50 border border-indigo-150 rounded-lg px-2 py-0.5">
                  75%
                </span>
              </div>
              
              {/* Progress Bar track */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full w-3/4" />
              </div>
              
              {/* Calibrations status log */}
              <div className="flex justify-between items-center text-[8px] font-sora font-semibold pt-1 border-t border-slate-100">
                <span className="text-emerald-600">3 Completed</span>
                <span className="text-amber-600">1 Skipped</span>
              </div>
            </div>
          </div>
        );
      case "04":
        return (
          <div className="w-full h-48 bg-[#F4F4F6] border border-[#E6E6EB] rounded-[20px] flex items-center justify-center relative overflow-hidden">
            <img
              src={boostImg}
              alt="Boost Rocket"
              className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            {/* Soft overlay gradient to melt it into the warm editorial style */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bento-warm text-bento-title selection:bg-[#C87930]/10 selection:text-[#C87930] font-sans flex flex-col relative overflow-x-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Editorial Grid pattern */}
      <div className="absolute inset-0 editorial-grid opacity-100 pointer-events-none" />

      {/* Navbar header */}
      <nav className="relative z-50 border-b border-[var(--notebook-border)] bg-white/60 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-bento-body hover:text-bento-title transition-colors font-sora font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--notebook-text-muted)]" />
            <span>Return to Home</span>
          </Link>

          {/* Logo in center */}
          <Link
            to="/"
            className="font-serif text-2xl tracking-tight font-bold text-bento-title hover:opacity-80 transition-opacity"
          >
            Inquisitive
            <span className="text-[var(--color-amber-deep)] italic font-serif font-light">
              .
            </span>
          </Link>

          {/* App CTA */}
          <Link
            to="/app"
            className="bg-[#2a2520] hover:bg-[#1a1510] text-white font-sora font-bold text-[12px] px-5 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 group"
          >
            <span>Start Learning</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F5A84A] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Main Guide Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center space-y-4 max-w-2xl mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-bento-title font-serif leading-tight"
          >
            Master any skill, <br className="hidden sm:inline" />
            <span className="font-serif italic text-[var(--color-amber-deep)]">
              one roadmap
            </span>{" "}
            at a time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[13px] sm:text-[14px] leading-relaxed text-bento-body max-w-lg mx-auto font-sora font-normal"
          >
            Inquisitive combines generative intelligence with visual planning
            boards. Here is a brief guide to navigating your visual workspace.
          </motion.p>
        </div>

        {/* Bento Step Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
        >
          {steps.map((step) => {
            return (
              <motion.div
                key={step.num}
                variants={itemVariants}
                className="bg-white border border-[var(--notebook-border)] shadow-[0_8px_30px_rgba(0,0,0,0.015)] rounded-[32px] p-6 flex flex-col gap-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.035)] relative overflow-hidden group"
              >
                {/* Visual Panel representing step mimicking bento.png */}
                {renderStepVisual(step.num)}

                {/* Content info below */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-sora font-extrabold uppercase tracking-widest text-[9px] text-[var(--color-amber-label)]">
                      {step.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-serif text-bento-title leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-bento-body font-sans font-normal">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic separator line */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#E4DDD3] to-transparent my-16" />

        {/* Closing Visual Call To Action Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-4xl bg-white border border-[var(--notebook-border)] shadow-[0_8px_30px_rgba(0,0,0,0.015)] rounded-[32px] p-8 md:p-12 text-center relative z-10 flex flex-col items-center gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.035)] transition-all duration-500 ease-out"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-warm-input)] border border-[var(--notebook-border)] flex items-center justify-center text-[var(--color-amber-deep)]">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-bento-title font-serif leading-tight">
              Ready to construct your roadmap?
            </h2>
            <p className="text-[13px] leading-relaxed text-bento-body max-w-sm mx-auto font-normal font-sans">
              Dive in and generate your first custom AI curriculum. Take charge
              of your learning goals with modular visual roadmaps today.
            </p>
          </div>

          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2a2520] hover:bg-[#1a1510] text-white px-8 py-3.5 font-sora font-semibold text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(42,37,32,0.15)] group"
          >
            <span>Launch Inquisitive App</span>
            <ArrowRight className="w-4 h-4 text-[#F5A84A] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-[var(--notebook-border)] bg-white/40 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-[11px] font-sora font-bold uppercase tracking-widest text-bento-muted">
            Inquisitive © {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-[var(--notebook-text-muted)] font-normal font-sans">
            Crafted for life-long learners and curious minds.
          </p>
        </div>
      </footer>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowLeft, BookOpen } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bento-warm text-bento-title selection:bg-[#C87930]/10 selection:text-[#C87930] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* Editorial Grid pattern */}
      <div className="absolute inset-0 editorial-grid opacity-100 pointer-events-none" />

      {/* Main 404 Bento Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-white border border-[var(--notebook-border)] shadow-[0_12px_45px_rgba(0,0,0,0.02)] rounded-[32px] p-8 md:p-14 text-center relative z-10 flex flex-col items-center gap-6 md:gap-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out"
      >
        {/* Floating Playful 404 Card Visual */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-2, 1, -2] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-40 h-52 bg-[var(--bento-input-bg)] border border-[var(--notebook-border)] rounded-[22px] p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(0,0,0,0.02)] overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Subtle notebook page rules */}
          <div className="absolute inset-x-0 top-12 bottom-4 border-t border-dashed border-[#E4DDD3] flex flex-col justify-between py-2 pointer-events-none">
            <div className="border-b border-dashed border-[#E4DDD3]/60 w-full h-0" />
            <div className="border-b border-dashed border-[#E4DDD3]/60 w-full h-0" />
            <div className="border-b border-dashed border-[#E4DDD3]/60 w-full h-0" />
            <div className="border-b border-dashed border-[#E4DDD3]/60 w-full h-0" />
          </div>

          <div className="flex justify-between items-center z-10">
            <span className="font-sora font-semibold uppercase tracking-widest text-[9px] text-[#A0622A]">
              Page Missing
            </span>
            <Compass className="w-4 h-4 text-[#C87930] animate-spin" style={{ animationDuration: "12s" }} />
          </div>

          <div className="my-auto z-10">
            <h1 className="font-serif italic text-6xl text-[#C87930] tracking-tight select-none">
              404
            </h1>
          </div>

          <div className="flex justify-between items-center text-[9px] text-bento-muted font-mono z-10">
            <span>INDEX_ERR</span>
            <span>VOL_I</span>
          </div>
        </motion.div>

        {/* Content text */}
        <div className="space-y-3">
          <span className="font-sora font-bold uppercase tracking-widest text-[11px] text-[#A0622A]">
            Error Code: PATH_NOT_FOUND
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-bento-title font-serif leading-tight">
            Lost in the margins.
          </h2>
          <p className="text-[13px] font-normal leading-relaxed text-bento-body max-w-sm mx-auto">
            This learning roadmap has wandered off the grid. It might be archived, renamed, or currently compiling in another universe.
          </p>
        </div>

        {/* Dynamic separator */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E4DDD3] to-transparent" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#2a2520] hover:bg-[#1a1510] text-white px-6 py-3 font-sora font-semibold text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(42,37,32,0.15)] group"
          >
            <BookOpen className="w-4 h-4 text-[#F5A84A] group-hover:rotate-6 transition-transform" />
            Back to Notebooks
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#D4C4A8] bg-white/60 text-[#2A2520] px-6 py-3 font-sora font-semibold text-[13px] hover:bg-white hover:border-[#C4A87A] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Landing Page
          </Link>
        </div>
      </motion.div>

      {/* Soft Footer Branding */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-[11px] font-sora font-medium uppercase tracking-widest text-bento-muted z-10"
      >
        Inquisitive © {new Date().getFullYear()}
      </motion.p>
    </div>
  );
}

import React, { useState } from "react";
import { ArrowUp, ChevronDown, Layers, Hourglass } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchSectionProps {
  topic: string;
  setTopic: (val: string) => void;
  level?: "beginner" | "intermediate" | "hard";
  setLevel: (val: "beginner" | "intermediate" | "hard") => void;
  length?: "short" | "medium" | "long";
  setLength: (val: "short" | "medium" | "long") => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchSection({
  topic,
  setTopic,
  level = "beginner",
  setLevel,
  length = "medium",
  setLength,
  isSubmitting,
  onSubmit,
}: SearchSectionProps) {
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [isLengthDropdownOpen, setIsLengthDropdownOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (topic.trim() && !isSubmitting) {
        onSubmit(e);
      }
    }
  };

  return (
    <div className="space-y-6 pt-1 max-w-3xl mx-auto w-full font-sora">
      {/* Compact Heading */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-[var(--bento-text-title)] font-serif tracking-tight leading-tight max-w-2xl mx-auto">
          You{" "}
          <span className="font-serif italic underline decoration-wavy decoration-[var(--color-amber-mid)] decoration-1 underline-offset-4">
            Can
          </span>{" "}
          Learn Anything.
        </h1>
        <div className="text-[var(--bento-text-body)] text-sm font-medium tracking-wide flex justify-center items-center gap-2">
          <span className="font-semibold text-[var(--bento-text-title)]">
            AI that will boost your brain.
          </span>
          <span className="text-[var(--bento-text-muted)]">•</span>
          <span className="text-[var(--bento-text-body)]">
            Get started for free.
          </span>
        </div>
      </div>

      {/* Input Form & Droptdown Toolbar */}
      <form onSubmit={onSubmit} className="relative w-full">
        <div className="w-full bg-white border border-[var(--color-warm-border)] rounded-[var(--radius-badge)] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col gap-3 relative">
          <textarea
            id="topic"
            placeholder="I want to learn..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-lg md:text-xl text-[var(--bento-text-title)] placeholder-[var(--bento-text-muted)] focus:outline-none resize-none font-serif italic h-20 px-1 py-1"
            disabled={isSubmitting}
            required
          />

          <div className="flex flex-col gap-2 border-t border-[var(--color-warm-border)]/40 pt-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Difficulty Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLevelDropdownOpen(!isLevelDropdownOpen);
                      setIsLengthDropdownOpen(false);
                    }}
                    className="px-3.5 py-2 text-sm font-semibold rounded-[var(--radius-button)] border border-[var(--color-warm-border)] bg-[var(--color-warm-input)] hover:bg-white text-[var(--bento-text-body)] transition-all flex items-center gap-1 shadow-sm active:scale-95 font-sora"
                  >
                    <Layers className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
                    <span>
                      Diff:{" "}
                      <strong className="text-[var(--bento-text-title)] font-bold capitalize">
                        {level === "hard" ? "Advanced" : level}
                      </strong>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[var(--bento-text-muted)] transition-transform duration-200 ${isLevelDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isLevelDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsLevelDropdownOpen(false)}
                      />
                      <div className="absolute left-0 mt-1 w-36 bg-white border border-[var(--color-warm-border)] rounded-[var(--radius-dropdown)] overflow-hidden shadow-lg py-1 z-30 animate-drop-in origin-top-left">
                        {(["beginner", "intermediate", "hard"] as const).map(
                          (lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => {
                                setLevel(lvl);
                                setIsLevelDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-slate-50 font-sora ${level === lvl ? "text-[var(--color-amber-deep)] bg-[var(--color-warm-input)] font-bold" : "text-[var(--bento-text-body)]"}`}
                            >
                              {lvl === "hard"
                                ? "Advanced"
                                : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Length Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLengthDropdownOpen(!isLengthDropdownOpen);
                      setIsLevelDropdownOpen(false);
                    }}
                    className="px-3.5 py-2 text-sm font-semibold rounded-[var(--radius-button)] border border-[var(--color-warm-border)] bg-[var(--color-warm-input)] hover:bg-white text-[var(--bento-text-body)] transition-all flex items-center gap-1 shadow-sm active:scale-95 font-sora"
                  >
                    <Hourglass className="w-3.5 h-3.5 text-[var(--bento-text-muted)]" />
                    <span>
                      Size:{" "}
                      <strong className="text-[var(--bento-text-title)] font-bold capitalize">
                        {length}
                      </strong>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[var(--bento-text-muted)] transition-transform duration-200 ${isLengthDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isLengthDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsLengthDropdownOpen(false)}
                      />
                      <div className="absolute left-0 mt-1 w-36 bg-white border border-[var(--color-warm-border)] rounded-[var(--radius-dropdown)] overflow-hidden shadow-lg py-1 z-30 animate-drop-in origin-top-left">
                        {(["short", "medium", "long"] as const).map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => {
                              setLength(len);
                              setIsLengthDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-slate-50 font-sora ${length === len ? "text-[var(--color-amber-deep)] bg-[var(--color-warm-input)] font-bold" : "text-[var(--bento-text-body)]"}`}
                          >
                            {len.charAt(0).toUpperCase() + len.slice(1)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Arrow */}
              <button
                type="submit"
                disabled={isSubmitting || !topic.trim()}
                className="w-8 h-8 rounded-full bg-[var(--color-amber-deep)] hover:bg-slate-800 text-white flex items-center justify-center transition-all disabled:opacity-35 disabled:pointer-events-none active:scale-95 shadow-xs"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* Dropdown helper explanation text */}
            <p className="text-xs text-[var(--bento-text-muted)] font-sora font-light pl-1 select-none">
              Difficulty sets the depth of resources. Size controls how many are
              included.
            </p>
          </div>

          {/* Suggestion List cleanly integrated inside the input card */}
          <div className="flex flex-col mt-4 pt-3.5 border-t border-[var(--color-warm-border)]/30 w-full font-sora">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--bento-text-muted)] mb-2 px-2 select-none">
              Try a Curated Topic Starter
            </div>
            <div className="flex flex-col">
              {[
                "Teach Me Guitar",
                "Editing with daVinci Resolve",
                "The science of volcanoes",
                "How do jet engines work?",
              ].map((suggestion, idx, arr) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setTopic(suggestion)}
                  className={cn(
                    "w-full text-left py-2 px-2 flex items-center gap-3 text-xs md:text-sm hover:bg-[var(--color-warm-input)]/70 transition-all group font-sora rounded-lg",
                    idx !== arr.length - 1 ? "border-b border-[var(--color-warm-border)]/30" : ""
                  )}
                  disabled={isSubmitting}
                >
                  <span className="text-[var(--color-amber-deep)] font-extrabold transition-transform duration-200 group-hover:translate-x-0.5 font-sora select-none">
                    →
                  </span>
                  <span className="font-semibold text-[var(--bento-text-body)] group-hover:text-[var(--bento-text-title)] font-sora transition-colors duration-200">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

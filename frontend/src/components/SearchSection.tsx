import React, { useState } from "react";
import { ArrowUp, ChevronDown, Layers, Hourglass } from "lucide-react";

interface SearchSectionProps {
  topic: string;
  setTopic: (val: string) => void;
  level: "beginner" | "intermediate" | "hard";
  setLevel: (val: "beginner" | "intermediate" | "hard") => void;
  length: "short" | "medium" | "long";
  setLength: (val: "short" | "medium" | "long") => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchSection({
  topic,
  setTopic,
  level,
  setLevel,
  length,
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
    <div className="space-y-4 pt-1 max-w-2xl mx-auto w-full font-neoris">
      {/* Compact Mascot & Heading */}
      <div className="text-center space-y-1.5">
        <h1 className="text-3xl md:text-4xl text-[var(--notebook-text-primary)] font-serif tracking-tight leading-tight max-w-xl mx-auto">
          Learn{" "}
          <span className="font-serif italic underline decoration-wavy decoration-indigo-400 decoration-1 underline-offset-4">
            anything
          </span>{" "}
          without the noise.
        </h1>
        <div className="text-[var(--notebook-text-secondary)] text-xs font-light tracking-wide flex justify-center items-center gap-1.5">
          <span className="font-medium text-[var(--notebook-text-primary)]">
            AI that won't make you stupid.
          </span>
          <span className="text-[var(--notebook-text-muted)]">•</span>
          <span>Get started for free.</span>
        </div>
      </div>

      {/* Input Form & Droptdown Toolbar */}
      <form onSubmit={onSubmit} className="relative w-full">
        <div className="w-full bg-white border border-[var(--notebook-border)] rounded-[var(--radius-badge)] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col gap-3 relative">
          <textarea
            id="topic"
            placeholder="I want to learn..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-base text-[var(--notebook-text-primary)] placeholder-[var(--notebook-text-muted)] focus:outline-none resize-none font-serif italic h-14 px-0.5 py-0.5"
            disabled={isSubmitting}
            required
          />

          <div className="flex items-center justify-between border-t border-[var(--notebook-border)]/40 pt-2.5">
            <div className="flex items-center gap-2">
              {/* Difficulty Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsLevelDropdownOpen(!isLevelDropdownOpen);
                    setIsLengthDropdownOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-[11px] font-semibold rounded-[var(--radius-button)] border border-[var(--notebook-border)] bg-[#FAF9F6]/40 hover:bg-[#FAF9F6] text-[var(--notebook-text-secondary)] transition-all flex items-center gap-1 shadow-sm active:scale-95 font-neoris"
                >
                  <Layers className="w-3.5 h-3.5 text-[var(--notebook-text-muted)]" />
                  <span>
                    Diff:{" "}
                    <strong className="text-[var(--notebook-text-primary)] font-bold capitalize">
                      {level === "hard" ? "Advanced" : level}
                    </strong>
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-[var(--notebook-text-muted)] transition-transform duration-200 ${isLevelDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isLevelDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsLevelDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-1 w-36 bg-white border border-[var(--notebook-border)] rounded-[var(--radius-button)] shadow-lg py-1 z-30 animate-drop-in origin-top-left">
                      {(["beginner", "intermediate", "hard"] as const).map(
                        (lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              setLevel(lvl);
                              setIsLevelDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-50 font-neoris ${level === lvl ? "text-[var(--notebook-text-primary)] bg-[#FAF9F6] font-bold" : "text-[var(--notebook-text-secondary)]"}`}
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
                  className="px-2.5 py-1.5 text-[11px] font-semibold rounded-[var(--radius-button)] border border-[var(--notebook-border)] bg-[#FAF9F6]/40 hover:bg-[#FAF9F6] text-[var(--notebook-text-secondary)] transition-all flex items-center gap-1 shadow-sm active:scale-95 font-neoris"
                >
                  <Hourglass className="w-3.5 h-3.5 text-[var(--notebook-text-muted)]" />
                  <span>
                    Size:{" "}
                    <strong className="text-[var(--notebook-text-primary)] font-bold capitalize">
                      {length}
                    </strong>
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-[var(--notebook-text-muted)] transition-transform duration-200 ${isLengthDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isLengthDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsLengthDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-1 w-36 bg-white border border-[var(--notebook-border)] rounded-[var(--radius-button)] shadow-lg py-1 z-30 animate-drop-in origin-top-left">
                      {(["short", "medium", "long"] as const).map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => {
                            setLength(len);
                            setIsLengthDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-50 font-neoris ${length === len ? "text-[var(--notebook-text-primary)] bg-[#FAF9F6] font-bold" : "text-[var(--notebook-text-secondary)]"}`}
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
              className="w-8 h-8 rounded-full bg-[var(--notebook-text-primary)] hover:bg-slate-800 text-white flex items-center justify-center transition-all disabled:opacity-35 disabled:pointer-events-none active:scale-95 shadow-xs"
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
        </div>
      </form>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full px-6 md:px-16 lg:px-24 py-24 md:py-32 bg-bento-warm border-t border-[var(--notebook-border)] relative overflow-hidden">
      {/* Decorative background hexagons — faint, top-right */}
      <div
        className="absolute -top-16 -right-16 opacity-[0.07] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg width="420" height="420" viewBox="0 0 420 420">
          <polygon
            points="210,20 390,120 390,300 210,400 30,300 30,120"
            fill="#E07820"
          />
        </svg>
      </div>
      <div
        className="absolute -top-8 -right-8 opacity-[0.05] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg width="280" height="280" viewBox="0 0 280 280">
          <polygon
            points="140,14 258,80 258,200 140,266 22,200 22,80"
            fill="#F0923A"
          />
        </svg>
      </div>

      {/* Bottom-left faint hex */}
      <div
        className="absolute -bottom-20 -left-20 opacity-[0.05] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg width="360" height="360" viewBox="0 0 360 360">
          <polygon
            points="180,18 334,102 334,258 180,342 26,258 26,102"
            fill="#E07820"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] font-sora font-semibold uppercase tracking-[0.18em] text-[#A0622A]"
          >
            Start Learning Today
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.85,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-bento-title max-w-3xl"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Knowledge is priceless.
            <br />
            <span className="italic text-[#C87930]">Inquisitive</span> is free.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15px] md:text-base text-bento-body font-sans font-normal leading-relaxed max-w-md"
          >
            No signup fees. No paywalls. Just an AI-curated learning path for
            anything you want to master — starting right now.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            {/* Primary CTA */}
            <Link
              to="/app"
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2A2520] text-white text-[14px] font-sora font-semibold hover:bg-[#1A1510] transition-colors duration-200 shadow-[0_4px_16px_rgba(42,37,32,0.18)]"
            >
              Start for free
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Trust nudge */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[12px] text-bento-muted font-sans font-normal"
          >
            No account needed · Works on any device · Free forever
          </motion.p>
        </div>
      </div>
    </section>
  );
}

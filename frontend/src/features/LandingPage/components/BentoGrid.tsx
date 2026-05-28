import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import achieveGoalsImg from "../../../assets/images/bento-images/achieve_goals.png";
import boostImg from "../../../assets/images/bento-images/boost.png";
import learnAnythingImg from "../../../assets/images/bento-images/learn_anything.png";
import learnAtYourPaceImg from "../../../assets/images/bento-images/learn_at_your_pace.png";
import personalisedImg from "../../../assets/images/bento-images/personalised.png";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function BentoGrid() {
  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-16 lg:px-24 bg-bento-warm border-t border-[var(--notebook-border)] relative z-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-left max-w-2xl">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--notebook-text-primary)] mt-5 mb-6 leading-tight">
            A smarter way to build your mind
          </h2>
          <p className="font-sans text-base md:text-lg text-[var(--notebook-text-secondary)] leading-relaxed">
            Inquisitive replaces endless bookmarks and overwhelming tabs with an
            elegant, visual roadmap tailored specifically to your learning
            goals.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] gap-3">
          {/* Card 1 — Learn Anything: Amber Hexagon + copy */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="rounded-[22px] overflow-hidden flex flex-col justify-between bg-gradient-amber min-h-[260px] relative group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out p-7"
          >
            <div>
              <p className="text-[11px] font-sora font-semibold uppercase tracking-widest text-[#A0622A] mb-2">
                Search
              </p>
              <h3
                className="text-[22px] leading-[1.25] text-bento-title font-medium mb-2"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Learn Anything
              </h3>
              <p className="text-[13px] text-bento-body leading-relaxed font-sans font-normal">
                Chess, cooking, guitar — search any topic and we'll build a
                focused path for you instantly.
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="relative flex items-center justify-center w-28 h-28 transition-transform duration-500 ease-out group-hover:scale-105">
                <svg
                  className="absolute"
                  width="112"
                  height="112"
                  viewBox="0 0 144 144"
                >
                  <polygon
                    points="72,8 132,42 132,102 72,136 12,102 12,42"
                    fill="#F5A84A"
                    opacity="0.18"
                  />
                </svg>
                <svg
                  className="absolute"
                  width="86"
                  height="86"
                  viewBox="0 0 110 110"
                >
                  <polygon
                    points="55,6 102,31 102,79 55,104 8,79 8,31"
                    fill="#F0923A"
                    opacity="0.55"
                  />
                </svg>
                <svg
                  className="relative z-10"
                  width="52"
                  height="52"
                  viewBox="0 0 68 68"
                >
                  <polygon
                    points="34,4 63,20 63,48 34,64 5,48 5,20"
                    fill="#E07820"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Personalised: text + personalisedImg peek at bottom */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="bg-white rounded-[22px] flex flex-col justify-between p-8 min-h-[260px] border border-[var(--notebook-border)] hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out group overflow-hidden"
          >
            <div>
              <h3
                className="text-[28px] leading-[1.2] text-bento-title mb-3 font-medium"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Optimizing Your Mind,{" "}
                <span className="text-[#C87930] italic font-serif">
                  Elevating
                </span>
                <br />
                Your Life
              </h3>
              <p className="text-[13.5px] text-bento-body leading-relaxed font-sans font-normal">
                We create a personalised learning roadmap built for your unique
                goals, speed, and interests.
              </p>
            </div>
            {/* Rounded preview block — floats naturally in the card */}
            <div className="w-full h-[120px] rounded-2xl overflow-hidden mt-4 border border-[var(--notebook-border)]">
              <img
                src={boostImg}
                alt="Personalised roadmap"
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Card 3 — Learn At Your Pace: oval crop of learnAtYourPaceImg */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="rounded-[22px] overflow-hidden flex flex-col justify-between p-6 bg-gradient-peach min-h-[260px] relative group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
          >
            <div>
              <p className="text-[11px] font-sora font-semibold uppercase tracking-widest text-[#A0622A] mb-2">
                Self-Paced
              </p>
              <h3
                className="text-[20px] leading-[1.25] text-bento-title font-medium mb-2"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Learn at your own pace
              </h3>
              <p className="text-[12.5px] text-bento-body leading-relaxed font-sans font-normal">
                The resources are yours forever. Pause, reorder, and study
                exactly as you wish.
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div
                className="overflow-hidden shadow-md border border-white/20 transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ width: 258, height: 158, borderRadius: 22 }}
              >
                <img
                  src={learnAtYourPaceImg}
                  alt="Learn at your own pace"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 4 — Boost Your Career: learnAnythingImg full-bleed */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="rounded-[22px] overflow-hidden relative min-h-[240px] hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out group"
          >
            <img
              src={learnAnythingImg}
              alt="Boost your career"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div
              className=" absolute top-2 left-6 text-white text-[20px] leading-[1.25] font-medium mb-2"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Boost Your Career
            </div>
          </motion.div>

          {/* Card 5 — Achieve Your Goals: chat card, achieveGoalsImg as avatar */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="bg-white rounded-[22px] flex flex-col gap-4 p-6 min-h-[240px] border border-[var(--notebook-border)] hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#D4C4B0]">
                <img
                  src={achieveGoalsImg}
                  alt="User"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-[14px] font-medium text-bento-title leading-tight">
                  Marcus Vance
                </p>
                <p className="text-[12px] text-bento-muted font-sans font-normal">
                  marcus.v@inquisitive.io
                </p>
              </div>
              <div className="ml-auto flex gap-1 items-center cursor-pointer">
                <span className="w-1 h-1 rounded-full bg-[#C0B8B0] block" />
                <span className="w-1 h-1 rounded-full bg-[#C0B8B0] block" />
                <span className="w-1 h-1 rounded-full bg-[#C0B8B0] block" />
              </div>
            </div>
            <p className="text-[13px] text-bento-body leading-relaxed flex-1 font-sans font-normal italic">
              "Can you build me a chess openings roadmap? I want to go from
              complete beginner to confident player in 30 days."
            </p>
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[var(--bento-input-bg)]">
              <span className="text-[13px] text-[#B0A8A0] font-sans font-normal select-none">
                Ask Inquisitive AI...
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer bg-[#E8893A] hover:bg-[#D4722C] transition-colors">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 6.5h9M6.5 2l4.5 4.5-4.5 4.5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 6 — Orange AI Orb (no image — gradient is the visual) */}
          <motion.div
            custom={5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="rounded-[22px] overflow-hidden relative flex flex-col justify-end p-5 bg-gradient-orange min-h-[240px] hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out group"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {[88, 140, 196].map((size, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                />
              ))}
              <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center bg-white/90 transition-transform duration-500 group-hover:scale-105">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M15 3 L17.8 11.2 L26 15 L17.8 18.8 L15 27 L12.2 18.8 L4 15 L12.2 11.2 Z"
                    fill="#E8893A"
                  />
                </svg>
              </div>
              <div
                className="absolute w-5 h-5 rounded-full"
                style={{
                  top: 30,
                  right: 28,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <div
                className="absolute w-4 h-4 rounded-full"
                style={{
                  bottom: 48,
                  left: 22,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <div
                className="absolute w-[18px] h-[18px] rounded-full"
                style={{
                  top: "50%",
                  right: 16,
                  transform: "translateY(-50%)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-serif italic text-[24px] leading-snug mb-3 font-normal">
                Achieve Your Goals
                <br />
                Every Single Day
              </h4>
              <Link
                to="/app"
                className="text-[12px] text-white/90 border border-white/40 rounded-full px-4 py-1.5 bg-transparent hover:bg-white/10 transition-colors font-sora font-semibold inline-block"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

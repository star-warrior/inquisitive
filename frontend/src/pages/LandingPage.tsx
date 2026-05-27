import { useEffect } from "react";
import { motion } from "framer-motion";
import heroBg from "../assets/images/hero-page.png";

export default function LandingPage() {
  const navLinks = [{ label: "How to use", active: true }];

  return (
    <div
      className="min-h-screen font-sans bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-start gap-16 px-8 py-6 md:px-16 bg-transparent">
        {/* Logo */}
        <div className="font-serif text-3xl text-white cursor-pointer tracking-tight select-none">
          Inquisitive
        </div>

        {/* Center Navigation Glass Pill + Outer Links + CTA */}
        <div className="flex items-center gap-6">
          {/* Glass Pill Container */}
          <div className="hidden lg:flex items-center bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-[var(--radius-button)] p-[var(--spacing-inner)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                className={`text-white/80 hover:text-white hover:bg-[var(--glass-hover)] text-[13.5px] font-medium px-4 py-1.5 rounded-[var(--radius-button-inner)] transition-colors cursor-pointer border-r border-white/5 last:border-r-0 ${
                  link.active ? "bg-white/10 text-white" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Outer Links */}
          <a className="text-white/85 hover:text-white text-sm font-medium px-4 py-2 transition-colors cursor-pointer">
            Pricing
          </a>

          {/* CTA Button */}
          <a
            className="bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold text-sm px-5 py-2.5 rounded-[var(--radius-button)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 tracking-tight cursor-pointer"
            href="/app"
          >
            Start learning
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-8 md:px-16 pt-8 max-w-7xl flex justify-between">
        {/* Left Column: Hero Content with Staggered Framer Motion Animations */}
        <div className="max-w-[540px] pt-4">
          <motion.h1
            className="font-serif text-3xl md:text-[48px] font-semibold text-white leading-[1.1] mb-5 tracking-tight"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
          >
            Inquisitive lets you master any skill with AI
          </motion.h1>

          <motion.p
            className="text-lg text-white/85 leading-relaxed mb-8 font-normal tracking-tight max-w-[480px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.25,
            }}
          >
            Plan, organize, and execute your learning journey without the
            information overload.
          </motion.p>

          <motion.div
            className="flex gap-4 items-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.4,
            }}
          >
            <a
              className="bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold text-sm px-5 py-2.5 rounded-[var(--radius-button)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 tracking-tight cursor-pointer"
              href="/app"
            >
              Start learning
            </a>
            <a className="bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] border border-[var(--btn-secondary-border)] text-white font-semibold text-sm px-5 py-2.5 rounded-[var(--radius-button)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Check out the launch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

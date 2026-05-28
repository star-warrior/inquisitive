import { motion } from "framer-motion";
import heroBg from "../../../assets/images/hero-page.png";

export default function Hero() {
  const navLinks = [{ label: "How to use", active: true }];

  return (
    <div
      className="w-full min-h-[90vh] md:min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden flex flex-col pb-16"
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
          <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md border border-white/25 rounded-xl p-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                className={`text-white hover:bg-white/10 text-[13.5px] font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer border-r border-white/5 last:border-r-0 ${
                  link.active ? "bg-white/15 text-white" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Outer Links */}
          <a className="bg-white/10 border border-white/25 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
            Pricing
          </a>

          {/* CTA Button */}
          <a
            className="bg-white hover:bg-white/90 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 tracking-tight cursor-pointer"
            href="/app"
          >
            Start learning
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 px-8 md:px-16 pt-4 md:pt-10 max-w-7xl flex flex-col justify-start flex-1">
        <div className="max-w-[540px] pt-4">
          <motion.h1
            className="font-sora text-3xl md:text-[48px] font-semibold text-white leading-[1.1] mb-5 tracking-tight"
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
              className="bg-white hover:bg-white/90 text-slate-900 font-semibold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 tracking-tight cursor-pointer"
              href="/app"
            >
              Start learning
            </a>
            <a className="bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-sm px-6 py-3 rounded-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Check out the launch
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

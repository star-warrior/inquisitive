import Hero from "../features/LandingPage/components/Hero";
import BentoGrid from "../features/LandingPage/components/BentoGrid";
import Footer from "../features/LandingPage/components/Footer";
import CTASection from "../features/LandingPage/components/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-slate-950 text-[#121314] overflow-x-hidden scroll-smooth flex flex-col">
      <Hero />
      <BentoGrid />
      <CTASection />
      <Footer />
    </div>
  );
}

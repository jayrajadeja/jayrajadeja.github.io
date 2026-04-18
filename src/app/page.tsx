import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import BentoGrid from "@/components/BentoGrid";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="pt-32">
      <HeroSection />
      <StatsSection />
      <BentoGrid />
      <CTASection />
    </div>
  );
}

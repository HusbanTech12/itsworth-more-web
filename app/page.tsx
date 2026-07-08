import { HeroSection } from "@/components/home/HeroSection";
import { AsSeenOn } from "@/components/home/AsSeenOn";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AsSeenOn />
      <CategoryGrid />
      <HowItWorks />
      <WhyChooseUs />
      <TestimonialCarousel />
      <FAQSection />
      <CTASection />
    </>
  );
}

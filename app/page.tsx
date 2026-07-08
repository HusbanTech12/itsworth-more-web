import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { AsSeenOn } from "@/components/home/AsSeenOn";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "ItsWorthMore — Sell Used Electronics for Cash | Instant Quotes",
  description:
    "Turn clutter into cash. Sell your used phones, tablets, laptops, and more with instant quotes, free shipping, and fast payments. Trusted by 20,000+ sellers.",
  openGraph: {
    title: "ItsWorthMore — Sell Used Electronics for Cash",
    description: "Turn clutter into cash. Free shipping, fast payments.",
  },
};

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

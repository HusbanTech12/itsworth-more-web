import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { AsSeenOn } from "@/components/home/AsSeenOn";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { AboutStats } from "@/components/home/AboutStats";
import { BlogCardGrid } from "@/components/home/BlogCardGrid";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "CashingTech — Sell Used Electronics for Cash | Instant Quotes",
  description:
    "Turn clutter into cash. Sell your used phones, tablets, laptops, and more with instant quotes, free shipping, and fast payments. Trusted by 20,000+ sellers.",
  openGraph: {
    title: "CashingTech — Sell Used Electronics for Cash",
    description: "Turn clutter into cash. Free shipping, fast payments.",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollReveal><AsSeenOn /></ScrollReveal>
      <ScrollReveal><CategoryGrid /></ScrollReveal>
      <ScrollReveal delay={100}><HowItWorks /></ScrollReveal>
      <ScrollReveal delay={100}><WhyChooseUs /></ScrollReveal>
      <ScrollReveal delay={100}><BlogCardGrid /></ScrollReveal>
      <ScrollReveal delay={100}><TestimonialCarousel /></ScrollReveal>
      <ScrollReveal delay={100}><FAQSection /></ScrollReveal>
      <ScrollReveal delay={100}><CTASection /></ScrollReveal>
    </>
  );
}

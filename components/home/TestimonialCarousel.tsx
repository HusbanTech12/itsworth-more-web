"use client";

import { useState, useEffect } from "react";
import { StarRating } from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Laura",
    location: "Fort Myers, FL",
    text: "Highly recommend ItsWorthMore.com. Easy to complete the sale and I received a much better value for my old iPhone 5s than any other offer. Communication was clear and timely. I will definitely use them again.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Robert",
    location: "Canyon Lake, TX",
    text: "Strongly Recommend ItsWorthMore.com. Very clear and simple process. Offer was confirmed on receipt of the iPad Pro and payment was promptly made. I received $150 more than using Apple's trade-in program.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Kassandra",
    location: "Encino, CA",
    text: "Very easy process! I gave an honest assessment of my old phone. They gave me an estimate. I printed their pre-paid shipping label and sent it off. They confirmed the amount and sent the funds via PayPal the next day.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Sandra",
    location: "Tumwater, WA",
    text: "They rated my iPad higher. I have sold 3 phones and one mini iPad quickly and efficiently. They even rated the iPad higher than I did. Kept me informed and paid quickly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Michael",
    location: "Charlottesville, VA",
    text: "Process is so easy. The offer made for my devices was much higher than the trade-in from the carrier. Shipping is included. Each step of the way you know what is happening. Best experience.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face&auto=format",
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection("right");
      setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i: number) => {
    setDirection(i > current ? "right" : "left");
    setCurrent(i);
  };

  const prev = () => {
    setDirection("left");
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  };

  const next = () => {
    setDirection("right");
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  };

  const t = testimonials[current];

  return (
    <section className="bg-cream py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
          What winning trust <span className="italic">sounds like</span>
        </h2>



        <div className="relative">
          <div className="min-h-[260px] flex flex-col items-center justify-center" key={current}>
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white mb-5 animate-fade-in">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-full h-full object-cover"
              />
            </div>
            <StarRating rating={t.rating} size="lg" />
            <blockquote className="mt-5 text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto italic">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <p className="mt-5 font-semibold text-ink">
              {t.name}
            </p>
            <p className="text-sm text-ink-muted">{t.location}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="rounded-full p-2 text-ink-muted hover:text-ink hover:bg-white transition-colors"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "bg-orange w-6" : "bg-border w-2 hover:bg-ink-muted"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full p-2 text-ink-muted hover:text-ink hover:bg-white transition-colors"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

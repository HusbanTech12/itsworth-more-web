"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Laura",
    location: "Fort Myers, FL",
    text: "Highly recommend ItsWorthMore.com. Easy to complete the sale and I received a much better value for my old iPhone 5s than any other offer. Communication was clear and timely. I will definitely use them again.",
    rating: 5,
  },
  {
    name: "Robert",
    location: "Canyon Lake, TX",
    text: "Strongly Recommend ItsWorthMore.com. Very clear and simple process. Offer was confirmed on receipt of the iPad Pro and payment was promptly made. I received $150 more than using Apple's trade-in program.",
    rating: 5,
  },
  {
    name: "Kassandra",
    location: "Encino, CA",
    text: "Very easy process! I gave an honest assessment of my old phone. They gave me an estimate. I printed their pre-paid shipping label and sent it off. They confirmed the amount and sent the funds via PayPal the next day.",
    rating: 5,
  },
  {
    name: "Sandra",
    location: "Tumwater, WA",
    text: "They rated my iPad higher. I have sold 3 phones and one mini iPad quickly and efficiently. They even rated the iPad higher than I did. Kept me informed and paid quickly.",
    rating: 5,
  },
  {
    name: "Michael",
    location: "Charlottesville, VA",
    text: "Process is so easy. The offer made for my devices was much higher than the trade-in from the carrier. Shipping is included. Each step of the way you know what is happening. Best experience.",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-10">
          What winning trust <span className="italic">sounds like</span>
        </h2>

        <div className="relative">
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <StarRating rating={t.rating} size="lg" />
            <blockquote className="mt-6 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl mx-auto">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <p className="mt-6 font-semibold text-zinc-900">
              {t.name}
            </p>
            <p className="text-sm text-zinc-400">{t.location}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="rounded-full p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
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
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-zinc-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
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

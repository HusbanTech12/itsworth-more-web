import type { Metadata } from "next";
import { CountUp } from "@/components/shared/CountUp";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — CashingTech",
  description:
    "Learn about CashingTech — the smarter way to sell your used electronics. Trusted by thousands for fast payments, free shipping, and honest quotes.",
};

const stats = [
  { end: 500, suffix: "K+", label: "Devices traded in" },
  { end: 20, suffix: "K+", label: "5-star reviews" },
  { end: 50, suffix: "M+", label: "Cash paid to sellers" },
  { end: 21, suffix: "", label: "Day quote lock" },
];

const values = [
  {
    title: "Transparency",
    description: "What you see is what you get. No hidden fees, no surprise deductions — just honest upfront pricing.",
  },
  {
    title: "Speed",
    description: "From quote to payment, we move fast. Most sellers get paid within 48 hours of device inspection.",
  },
  {
    title: "Trust",
    description: "With over 20,000 verified reviews and an A+ BBB rating, our reputation speaks for itself.",
  },
  {
    title: "Simplicity",
    description: "Three easy steps: quote, ship, get paid. No listings, no haggling, no waiting around.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-4">
                About Us
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-none tracking-[-0.03em] font-heading">
                We make selling old tech{" "}
                <span className="text-orange">
                  ridiculously easy
                </span>
              </h1>
              <p className="mt-6 text-lg text-ink-muted leading-snug">
                CashingTech was built for people who want to clear out their drawers without the
                headache. We give you a real offer upfront, cover the shipping, and get cash in your
                pocket — fast.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg self-center">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&fit=crop&auto=format"
                alt="Team collaboration"
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-lime">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading leading-tight">
              From a garage to a marketplace
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              We started CashingTech because we were frustrated with the old way of selling
              electronics — lowball trade-in offers, sketchy marketplaces, and waiting weeks for
              payment. So we built something better.
            </p>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Today we&apos;ve helped over half a million people turn their old phones, laptops,
              tablets, and gadgets into cash. Our team is spread across the US and UK, united by
              one mission: make selling used tech as simple as it should be.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-8 border border-border shadow-sm flex flex-col text-center hover:shadow-xl hover:shadow-orange/10 hover:border-orange/40 hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading leading-tight">
            Ready to turn your old tech into cash?
          </h2>
          <p className="mt-3 text-white/90">
            Get your instant quote in under 60 seconds. No obligations, no hassle.
          </p>
          <div className="mt-8">
            <Link
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-md bg-ink text-lime font-bold uppercase tracking-wide hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-black/20"
            >
              Start selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

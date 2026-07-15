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
                The easiest way to sell{" "}
                <span className="text-orange italic font-normal">
                  used electronics
                </span>
              </h1>
              <p className="mt-6 text-lg text-ink-muted leading-snug">
                CashingTech was built for people who want to clear out their drawers without the
                headache. We give you a real offer upfront, cover the shipping, and get cash in your
                pocket — fast. No back-and-forth haggling. No surprise fees. No waiting weeks for a
                check that might bounce. Just a straightforward process that puts money in your hand
                within days of us receiving your device. Whether you&apos;re upgrading your phone, clearing
                out a drawer of old gadgets, or managing a fleet of company devices, we make sure you
                get the best possible value with the least possible effort.
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
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-orange/30 flex items-center justify-center mx-auto hover:border-orange hover:scale-110 hover:shadow-[0_0_30px_8px_rgba(240,83,45,0.35)] transition-all duration-500">
                  <p className="text-3xl sm:text-4xl font-bold text-orange">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </p>
                </div>
                <p className="mt-3 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center mb-14">
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
              Today we&apos;ve helped over half a million people turn their old phones, laptops, tablets, and gadgets into cash. Our team is spread across the US and UK, united by one mission: make selling used tech as simple as it should be.
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

      {/* Our Locations */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Our Locations</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading leading-tight">
              US &amp; UK offices
            </h2>
            <p className="mt-3 text-ink-muted max-w-xl mx-auto">
              We&apos;re a global team with operations on both sides of the Atlantic.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="h-48 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80&fit=crop&auto=format"
                  alt="US Office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-ink">United States</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  1209 N Orange St,<br />
                  Wilmington, DE 19801
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="h-48 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80&fit=crop&auto=format"
                  alt="UK Office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-ink">United Kingdom</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  71–75 Shelton St,<br />
                  London WC2H 9JQ
                </p>
              </div>
            </div>
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

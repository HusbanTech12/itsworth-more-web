import type { Metadata } from "next";
import { CountUp } from "@/components/shared/CountUp";

export const metadata: Metadata = {
  title: "About Us — ItsWorthMore",
  description:
    "Learn about ItsWorthMore — the smarter way to sell your used electronics. Trusted by thousands for fast payments, free shipping, and honest quotes.",
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
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-zinc-50 py-20 lg:py-32">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="flex flex-col justify-center animate-fade-in">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">About Us</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-none tracking-tight font-serif">
                We make selling old tech{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  ridiculously easy
                </span>
              </h1>
              <p className="mt-6 text-lg text-zinc-500 leading-snug tracking-normal">
                ItsWorthMore was built for people who want to clear out their drawers without the
                headache. We give you a real offer upfront, cover the shipping, and get cash in your
                pocket — fast.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg self-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&fit=crop&auto=format"
                alt="Team collaboration"
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <p className="text-4xl sm:text-5xl font-bold text-primary hover:scale-125 transition-transform duration-300">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
              From a garage to a marketplace
            </h2>
            <p className="mt-4 text-zinc-500 leading-relaxed">
              We started ItsWorthMore because we were frustrated with the old way of selling
              electronics — lowball trade-in offers, sketchy marketplaces, and waiting weeks for
              payment. So we built something better.
            </p>
            <p className="mt-4 text-zinc-500 leading-relaxed">
              Today we&apos;ve helped over half a million people turn their old phones, laptops,
              tablets, and gadgets into cash. Our team is spread across the US and UK, united by
              one mission: make selling used tech as simple as it should be.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm flex flex-col text-center hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-zinc-900">{value.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif">
            Ready to turn your old tech into cash?
          </h2>
          <p className="mt-3 text-zinc-500">
            Get your instant quote in under 60 seconds. No obligations, no hassle.
          </p>
          <div className="mt-8">
            <a
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start selling
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

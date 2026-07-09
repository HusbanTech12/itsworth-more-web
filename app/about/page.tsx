import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — ItsWorthMore",
  description:
    "Learn about ItsWorthMore — the smarter way to sell your used electronics. Trusted by thousands for fast payments, free shipping, and honest quotes.",
};

const stats = [
  { value: "500K+", label: "Devices traded in" },
  { value: "20K+", label: "5-star reviews" },
  { value: "50M+", label: "Cash paid to sellers" },
  { value: "21", label: "Day quote lock" },
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
      <section className="bg-zinc-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">About Us</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
              We make selling old tech{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ridiculously easy
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              ItsWorthMore was built for people who want to clear out their drawers without the
              headache. We give you a real offer upfront, cover the shipping, and get cash in your
              pocket — fast.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
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

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-zinc-900">{value.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Ready to turn your old tech into cash?
          </h2>
          <p className="mt-3 text-zinc-500">
            Get your instant quote in under 60 seconds. No obligations, no hassle.
          </p>
          <div className="mt-8">
            <a
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Start selling
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

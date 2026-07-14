const steps = [
  {
    number: "01",
    title: "Get your Instant Quote",
    description: "Select your device and condition, and get your offer before you say goodbye to clutter.",
    icon: "M3 3h18v4H3zM3 11h18v4H3zM3 19h18v2H3z",
  },
  {
    number: "02",
    title: "Ship for Free",
    description: "Print the free, trackable label, and send it off. We'll handle the rest.",
    icon: "M3 7l9-4 9 4v10l-9 4-9-4z",
  },
  {
    number: "03",
    title: "Get Paid Fast",
    description: "No listings, waiting, or meeting strangers. Get paid after we inspect your device. Cha-ching!",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  },
];

export function HowItWorks() {
  const cardColors = [
    "bg-lime text-ink",
    "bg-orange text-white",
    "bg-ink text-white border border-white/10",
  ];

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-ink p-8 md:p-12 shadow-xl">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-3">
            Simple Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight">
            3 simple steps to get paid
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl p-8 overflow-hidden ${cardColors[i]} hover:-translate-y-2 transition-all duration-500 shadow-lg`}
            >
              <span className="absolute -top-2 -right-1 text-7xl font-bold opacity-10 select-none group-hover:opacity-20 transition-opacity duration-500">
                {step.number}
              </span>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                i === 0 ? "bg-ink/10" : "bg-white/15"
              }`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path d={step.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">
                {step.title}
              </h3>
              <p className={`text-sm leading-relaxed relative z-10 ${i === 0 ? "text-ink/70" : "text-white/70"}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

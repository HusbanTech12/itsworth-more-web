const logos = [
  { name: "CNBC" },
  { name: "USA Today" },
  { name: "ZDNet" },
  { name: "CNET" },
  { name: "PCWorld" },
  { name: "LA Times" },
];

export function AsSeenOn() {
  return (
    <section className="bg-ink border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-8">
          As featured on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <div
              key={logo.name}
              className="animate-fade-in text-lg sm:text-xl font-bold tracking-tight text-white/30 hover:text-white/50 transition-colors select-none"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

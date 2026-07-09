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
    <section className="border-y border-zinc-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 mb-8">
          As featured on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <div
              key={logo.name}
              className="animate-fade-in text-lg sm:text-xl font-bold tracking-tight text-zinc-300 hover:text-zinc-400 transition-colors select-none"
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

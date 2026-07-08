const logos = [
  { name: "CNBC", src: "cnbc-logo.svg" },
  { name: "USA Today", src: "usa-today-logo.svg" },
  { name: "ZDNet", src: "zdnet-logo.svg" },
  { name: "CNET", src: "cnet-logo.svg" },
  { name: "PCWorld", src: "pcworld-logo.png" },
  { name: "LA Times", src: "latimes-logo.png" },
];

export function AsSeenOn() {
  return (
    <section className="border-y border-zinc-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
          As featured on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="h-6 sm:h-7 w-24 sm:w-28 rounded bg-zinc-100 flex items-center justify-center text-xs text-zinc-400 font-medium"
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Get your Instant Quote",
    description: "Select your device and condition, and get your offer before you say goodbye to clutter.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop&auto=format",
    alt: "Phone with instant quote",
  },
  {
    number: "02",
    title: "Ship for Free",
    description: "Print the free, trackable label, and send it off. We'll handle the rest.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&auto=format",
    alt: "Parcel shipping box",
  },
  {
    number: "03",
    title: "Get Paid Fast",
    description: "No listings, waiting, or meeting strangers. Get paid after we inspect your device. Cha-ching!",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&auto=format",
    alt: "Cash payment",
  },
];

export function HowItWorks() {
  const cardColors = [
    "bg-lime text-ink",
    "bg-orange text-white",
    "bg-ink text-white",
  ];

  return (
    <section className="bg-cream py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink">
            simple steps to get paid
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 animate-slide-up overflow-hidden ${cardColors[i]}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className="absolute top-3 right-5 text-5xl font-bold opacity-20">
                {step.number}
              </span>
              <div className="relative h-24 mb-6 flex items-center justify-start">
                {step.image && (
                  <img
                    src={step.image}
                    alt={step.alt!}
                    className="h-full w-auto object-cover rounded-lg opacity-80"
                  />
                )}
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">
                {step.title}
              </h3>
              <p className={`text-sm leading-relaxed relative z-10 ${i === 0 ? "text-ink/70" : "text-white/70"}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

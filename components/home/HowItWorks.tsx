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
  return (
    <section className="bg-white py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Selling made simple
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative text-center group animate-slide-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {step.image && (
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3] bg-zinc-100">
                  <img
                    src={step.image}
                    alt={step.alt!}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center text-sm font-bold text-primary">
                    {step.number}
                  </div>
                </div>
              )}

              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-orange py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight animate-slide-up">
          Still Sitting on That Old Tech? Do Something Smart About It
        </h2>
        <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Swap your old tech for cash today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <a
            href="/sell"
            className="inline-flex items-center justify-center h-12 px-6 rounded-md text-base font-bold uppercase tracking-wide bg-ink text-lime hover:brightness-110 transition-all"
          >
            Sell your device now →
          </a>
          <a
            href="/custom-quote"
            className="inline-flex items-center justify-center h-12 px-6 rounded-md text-base font-bold uppercase tracking-wide border-2 border-white/30 text-white hover:bg-white/10 transition-all"
          >
            Get your free quote
          </a>
        </div>

      </div>
    </section>
  );
}

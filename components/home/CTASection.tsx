import Link from "next/link";

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=face&auto=format",
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-orange rounded-2xl py-16 lg:py-20 px-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-10 w-72 h-72 rounded-full bg-white/10 blur-[80px] animate-glow" />
            <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-ink/10 blur-[80px] animate-glow" style={{ animationDelay: "2s" }} />
          </div>
          <div className="text-center relative z-10">
        <div className="flex items-center justify-center -space-x-3 mb-6">
          {avatars.map((src, i) => (
            <div
              key={i}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-10 relative"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-ink flex items-center justify-center text-lime text-xs font-bold relative z-10">
            20k+
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-display">
          Your device is making someone money. <br />Make it yours.
        </h2>
        <p className="mt-4 text-white/90 text-lg max-w-lg mx-auto">
          Get your instant offer now. 60 seconds. No account. No obligation.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sell"
            className="group inline-flex items-center justify-center h-12 px-8 rounded-md text-base font-bold uppercase tracking-wide bg-ink text-lime hover:brightness-110 hover:scale-105 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
          >
            Get My Instant Offer
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
          <Link
            href="/custom-quote"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md text-base font-bold uppercase tracking-wide border-2 border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            Get your free quote
          </Link>
        </div>
        </div>
      </div>
    </div>
    </section>
  );
}

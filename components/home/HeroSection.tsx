import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Trusted by 20,000+ sellers
              </span>
            </div>

            <h1 className="animate-slide-up text-4xl sm:text-5xl lg:text-7xl font-serif tracking-tight text-zinc-900 leading-[1.08]">
              Sell old tech.{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
                Get paid fast.
              </span>
            </h1>

            <p
              className="animate-slide-up mt-6 text-lg sm:text-xl text-zinc-500 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              style={{ animationDelay: "0.1s" }}
            >
              Turn clutter into cash. Get an instant quote, ship for free, and
              get paid — all in under 48 hours after we receive your device.
            </p>

            <div
              className="animate-slide-up mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              style={{ animationDelay: "0.2s" }}
            >
              <Button size="lg" variant="primary">
                Start selling
              </Button>
              <Button size="lg" variant="outline">
                Get your free quote
              </Button>
            </div>

            <div
              className="animate-slide-up mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-zinc-400"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Free shipping
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                24h fast payout
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                No hidden fees
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent animate-float" />

              <div className="absolute inset-6 rounded-full bg-white shadow-xl flex items-center justify-center border border-zinc-100">
                <svg className="w-36 h-36 sm:w-44 sm:h-44 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>

              <div className="absolute -top-3 right-4 lg:right-6 bg-white rounded-xl shadow-lg px-4 py-3 border border-zinc-100 animate-float-delayed hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">iPhone 16 Pro Max</p>
                <p className="text-xl font-bold text-emerald-600">$890</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-zinc-400">Flawless</span>
                </div>
              </div>

              <div className="absolute -bottom-4 left-2 lg:left-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-zinc-100 animate-float-delayed hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" style={{ animationDelay: "1.5s" }}>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Samsung Galaxy S25</p>
                <p className="text-xl font-bold text-emerald-600">$720</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[11px] text-zinc-400">Good</span>
                </div>
              </div>

              <div className="absolute top-1/2 -left-6 lg:-left-8 bg-white rounded-xl shadow-lg px-4 py-3 border border-zinc-100 animate-float-delayed hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" style={{ animationDelay: "3s" }}>
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">MacBook Pro 16</p>
                <p className="text-xl font-bold text-emerald-600">$1,250</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="text-[11px] text-zinc-400">Like New</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

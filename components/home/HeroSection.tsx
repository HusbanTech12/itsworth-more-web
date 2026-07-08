import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-tight">
              Your device is worth{" "}
              <span className="text-primary">more than you think</span>.
            </h1>
            <p className="mt-6 text-lg text-zinc-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Turn clutter into cash. Sell your used electronics in minutes
              with instant quotes, free shipping, and fast payments.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="primary">
                Start selling
              </Button>
              <Button size="lg" variant="outline">
                Get your free quote
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-white shadow-2xl flex items-center justify-center">
                <svg className="w-32 h-32 sm:w-40 sm:h-40 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
            </div>

            <div className="absolute -top-4 right-8 lg:right-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-zinc-100 animate-slide-up">
              <p className="text-xs text-zinc-500">iPhone 16 Pro Max</p>
              <p className="text-lg font-bold text-emerald-600">$890</p>
            </div>
            <div className="absolute -bottom-2 left-8 lg:left-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-zinc-100 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <p className="text-xs text-zinc-500">Samsung Galaxy S25</p>
              <p className="text-lg font-bold text-emerald-600">$720</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

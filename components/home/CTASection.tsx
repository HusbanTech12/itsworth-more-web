import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Still Sitting on That Old Tech? Do Something Smart About It
        </h2>
        <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto">
          Swap your old tech for cash today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="secondary">
            Sell your device now
          </Button>
          <Button
            size="lg"
            className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Get your free quote
          </Button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white/30 bg-white/20"
              />
            ))}
          </div>
          <span>500,000+ satisfied clients</span>
        </div>
      </div>
    </section>
  );
}

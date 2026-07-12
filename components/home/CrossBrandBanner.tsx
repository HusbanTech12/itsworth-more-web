import Link from "next/link";

export function CrossBrandBanner() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="bg-ink rounded-2xl p-8 md:p-12 border border-lime border-t-0 animate-slide-up min-h-[220px] md:min-h-[260px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Two brands.{" "}
              <span className="text-lime">One mission.</span>
              <br />
              Get you paid.
            </h2>
            <p className="mt-3 text-white/50 text-sm max-w-lg mx-auto">
              CashingTech and Cashing Carz are part of the same family — same straight-up service, different lane.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-orange text-white font-bold uppercase tracking-wide text-sm hover:brightness-110 transition-all"
              >
                <span>🚗</span> Cashing Carz <span className="font-normal normal-case ml-1">We buy your car</span>
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-lime text-ink font-bold uppercase tracking-wide text-sm hover:brightness-110 transition-all"
              >
                <span>💻</span> CashingTech <span className="font-normal normal-case ml-1">We buy your tech</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

export default function SellError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="text-5xl sm:text-7xl font-bold text-border mb-4">Oops</p>
        <h1 className="text-2xl font-bold text-ink mb-2">Something went wrong</h1>
        <p className="text-ink-muted mb-8">
          We couldn&apos;t load this page. Try again or search for your device.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-6 text-sm font-semibold text-white hover:brightness-110 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

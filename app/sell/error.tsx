"use client";

export default function SellError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="text-7xl font-bold text-zinc-200 mb-4">Oops</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Something went wrong</h1>
        <p className="text-zinc-500 mb-8">
          We couldn&apos;t find what you&apos;re looking for. Try searching for your device.
        </p>
        <button
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="text-7xl font-bold text-zinc-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Page not found</h1>
        <p className="text-zinc-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

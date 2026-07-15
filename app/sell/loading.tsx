export default function SellLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-3 w-48 bg-zinc-200 rounded animate-pulse mb-3" />
          <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-zinc-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 overflow-hidden">
              <div className="aspect-square bg-zinc-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

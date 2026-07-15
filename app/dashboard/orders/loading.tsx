export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-zinc-200 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

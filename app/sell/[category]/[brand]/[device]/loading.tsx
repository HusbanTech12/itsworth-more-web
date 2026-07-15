export default function DeviceLoading() {
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
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-zinc-200 rounded-xl" />
          <div className="space-y-6">
            <div className="h-7 w-48 bg-zinc-200 rounded animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-zinc-200">
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-zinc-200 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-zinc-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

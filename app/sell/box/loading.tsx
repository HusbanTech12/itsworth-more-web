export default function BoxLoading() {
  return (
    <div className="min-h-[80vh] bg-white">
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200">
                <div className="w-16 h-16 bg-zinc-100 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

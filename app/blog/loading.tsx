export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-cream text-zinc-900 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-3 w-16 bg-zinc-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 bg-zinc-200 rounded animate-pulse mx-auto" />
        </div>
      </div>
      <div className="py-10 lg:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 overflow-hidden">
                <div className="aspect-[16/10] bg-zinc-200" />
                <div className="p-5 space-y-2">
                  <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-5 w-full bg-zinc-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-zinc-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

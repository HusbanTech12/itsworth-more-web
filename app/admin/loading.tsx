export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex">
        <div className="hidden lg:block w-64 border-r border-zinc-200 bg-white min-h-screen p-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-zinc-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-zinc-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-zinc-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

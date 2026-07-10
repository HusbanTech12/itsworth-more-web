export default function CheckoutLoading() {
  return (
    <div className="min-h-[80vh] bg-zinc-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-40 bg-zinc-200 rounded animate-pulse mb-8" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div className="h-5 w-32 bg-zinc-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-zinc-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

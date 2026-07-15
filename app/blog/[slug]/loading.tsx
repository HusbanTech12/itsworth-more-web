export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse mb-4" />
        <div className="h-10 w-full bg-zinc-200 rounded animate-pulse mb-4" />
        <div className="h-5 w-3/4 bg-zinc-200 rounded animate-pulse mb-8" />
        <div className="aspect-[2/1] bg-zinc-200 rounded-xl mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

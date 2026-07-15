export default function HomeLoading() {
  return (
    <>
      <section className="bg-cream py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-zinc-200 rounded animate-pulse" />
              <div className="h-12 w-3/4 bg-zinc-200 rounded animate-pulse" />
              <div className="h-5 w-full bg-zinc-200 rounded animate-pulse" />
              <div className="h-14 w-44 bg-zinc-200 rounded-full animate-pulse" />
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-zinc-200 rounded-full animate-pulse" />
                <div className="h-12 w-32 bg-zinc-200 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="aspect-square bg-zinc-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-28 bg-zinc-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 bg-zinc-200 rounded animate-pulse mx-auto mb-12" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 overflow-hidden">
                <div className="aspect-square bg-zinc-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-zinc-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 bg-zinc-200 rounded animate-pulse mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-8 space-y-4">
                <div className="w-14 h-14 bg-zinc-200 rounded-full animate-pulse" />
                <div className="h-5 w-32 bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-12" />
          <div className="grid md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-3 text-center">
                <div className="w-12 h-12 bg-zinc-200 rounded-full animate-pulse mx-auto" />
                <div className="h-5 w-24 bg-zinc-200 rounded animate-pulse mx-auto" />
                <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 bg-zinc-200 rounded animate-pulse mx-auto mb-12" />
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
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-200 rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-zinc-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-zinc-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-16 w-full bg-zinc-200 rounded animate-pulse" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-zinc-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-zinc-200 rounded animate-pulse mx-auto mb-12" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <div className="h-5 w-3/4 bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange/10 to-lime/10 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-10 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-zinc-200 rounded animate-pulse mx-auto" />
          <div className="h-14 w-44 bg-zinc-200 rounded-full animate-pulse mx-auto" />
        </div>
      </section>
    </>
  );
}

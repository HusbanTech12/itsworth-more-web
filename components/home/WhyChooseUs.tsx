const badges = [
  {
    title: "20,000+ Reviews",
    description: "Just read the reviews — our customers love us.",
    icon: (
      <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "BBB Rating",
    description: "Our rating with the Better Business Bureau.",
    icon: (
      <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
        BBB
      </div>
    ),
  },
  {
    title: "We Pay Fast!",
    description: "Assured payments within days.",
    icon: (
      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "As Seen On",
    description: "We're getting great recognition in the news.",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Higher Offer",
    description: "Our offer is higher than our competitors.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Elite Rating",
    description: "A top rating from ResellerRatings.com.",
    icon: (
      <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-zinc-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Why people choose us and love it
          </h2>
        </div>

        <div className="mx-auto max-w-5xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className="flex gap-4 p-6 rounded-xl bg-white border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 animate-slide-up group cursor-default"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
              <div>
                <h3 className="font-semibold text-zinc-900">{badge.title}</h3>
                <p className="text-sm text-zinc-500 mt-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

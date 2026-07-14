const trustBadges = [
  { icon: "★", label: "20k+ Reviews", description: "Join thousands of happy sellers who got paid fast." },
  { icon: "✓", label: "BBB Rating", description: "Accredited business with an A+ Better Business Bureau rating." },
  { icon: "⚡", label: "We Pay Fast", description: "Get paid within 24-48 hours after your device passes inspection." },
  { icon: "📺", label: "As Seen On", description: "Featured on CNBC, USA Today, CNET, and ZDNet." },
  { icon: "💰", label: "Higher Offer", description: "We beat Apple, Samsung, and carrier trade-in values." },
  { icon: "🏆", label: "Elite Rating", description: "Top-rated electronics buyback company with 5-star service." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">
            Trusted by Thousands
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight font-display">
            Why sellers choose us
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {trustBadges.map((badge, i) => (
            <div
              key={badge.label}
              className="bg-white border border-border rounded-2xl p-5 text-center transition-all duration-300 hover:border-orange/40 hover:-translate-y-1.5 hover:shadow-lg shadow-sm"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-2xl">{badge.icon}</span>
              <h3 className="text-sm font-bold text-ink mt-2">{badge.label}</h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

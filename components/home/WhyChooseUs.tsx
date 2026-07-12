const features = [
  {
    num: "01",
    title: "Instant Offers",
    description:
      "Select your device, pick its condition, and get an offer in seconds. No account needed, no phone calls, no back-and-forth.",
  },
  {
    num: "02",
    title: "21-Day Price Lock",
    description:
      "Worried prices might drop? We lock your quote for 21 days. Take your time packing it up — your offer stays the same.",
  },
  {
    num: "03",
    title: "Your Payment, Your Way",
    description:
      "PayPal, Zelle, Venmo, or old-school check. You choose how you get paid, and we send it within 24 hours of inspection.",
  },
  {
    num: "04",
    title: "We Beat Trade-Ins",
    description:
      "Compare our offer to Apple, Samsung, or your carrier. We guarantee more cash in your pocket — or we'll match it.",
  },
  {
    num: "05",
    title: "Even Broken Devices",
    description:
      "Cracked screen? Dead battery? Water damage? We still make an offer. Broken doesn't mean worthless.",
  },
  {
    num: "06",
    title: "Full Transparency",
    description:
      "Your offer is calculated upfront. No hidden fees, no surprise deductions. What you see is what you get paid.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3">
            WHY CASHINGTECH
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
            Built for sellers, not buyers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.num}
              className="bg-white border border-border rounded-2xl p-6 animate-slide-up transition-all duration-300 hover:border-orange/80 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange/10"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-3xl font-bold text-lime">{f.num}</span>
              <h3 className="text-lg font-bold text-ink mt-3">{f.title}</h3>
              <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

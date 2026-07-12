const quickLinks = [
  { label: "Sell iPhone", href: "/sell/phone/iphone" },
  { label: "Sell Samsung", href: "/sell/phone/samsung" },
  { label: "Sell iPad", href: "/sell/tablet/ipad" },
  { label: "Sell MacBook", href: "/sell/laptop/macbook" },
];

const categories = [
  { name: "Phone", slug: "phone", img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=90&fit=crop&auto=format" },
  { name: "Tablet", slug: "tablet", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=90&fit=crop&auto=format" },
  { name: "Laptop", slug: "laptop", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=3840&q=90&fit=crop&auto=format" },
];

export function CategoryGrid() {
  return (
    <section className="bg-ink py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3 animate-fade-in">
            What We Buy
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white animate-fade-in">
            Selling made simple
          </h2>
          <p className="mt-3 text-white/50 max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Find the device you&apos;d like to swap for cash.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-white/70 hover:bg-lime hover:text-ink hover:border-lime transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-6">
          {categories.map((cat, i) => (
            <a
              key={cat.slug}
              href={`/sell/${cat.slug}`}
              className={`group relative w-48 aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${i === 1 ? "ring-2 ring-lime" : ""}`}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-semibold text-white group-hover:text-lime transition-colors">
                  Sell {cat.name}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <a
            href="/sell"
            className="inline-flex items-center px-6 py-3 rounded-md bg-lime text-ink font-bold uppercase tracking-wide hover:brightness-110 transition-all"
          >
            View all categories →
          </a>
        </div>
      </div>
    </section>
  );
}

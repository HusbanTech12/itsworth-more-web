import Link from "next/link";

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
  { name: "Smartwatch", slug: "smartwatch", img: "https://images.unsplash.com/photo-1549482199-bc1ca6f58502?w=3840&q=90&fit=crop&auto=format" },
  { name: "Camera", slug: "camera", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=3840&q=90&fit=crop&auto=format" },
  { name: "Console", slug: "console", img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=3840&q=90&fit=crop&auto=format" },
];

export function CategoryGrid() {
  return (
    <section className="bg-cream py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">
            What We Buy
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink font-display leading-tight">
            Selling made simple
          </h2>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            Find the device you&apos;d like to swap for cash.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white border border-border text-sm font-medium text-ink-muted hover:text-orange hover:border-orange/40 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.slice(0, 3).map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/sell/${cat.slug}`}
              className="group relative w-full max-w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 ring-1 ring-border hover:ring-orange/40"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-orange/70 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-base font-semibold text-white group-hover:scale-105 origin-left transition-transform duration-300">
                  Sell {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {categories.slice(3).map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/sell/${cat.slug}`}
              className="group relative w-full max-w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 ring-1 ring-border hover:ring-orange/40"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-orange/70 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-base font-semibold text-white group-hover:scale-105 origin-left transition-transform duration-300">
                  Sell {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/sell"
            className="inline-flex items-center px-6 py-3 rounded-md bg-orange text-white font-bold uppercase tracking-wide hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-orange/20"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}

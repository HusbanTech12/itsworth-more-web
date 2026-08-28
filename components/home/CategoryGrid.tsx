import Link from "next/link";

const quickLinks = [
  { label: "Sell iPhone", href: "/sell/phone/iphone" },
  { label: "Sell Samsung", href: "/sell/phone/samsung" },
  { label: "Sell iPad", href: "/sell/tablet/ipad" },
  { label: "Sell MacBook", href: "/sell/laptop/macbook" },
];

const categories = [
  { name: "Phone", slug: "phone", img: "/images/categories/phone.webp" },
  { name: "Tablet", slug: "tablet", img: "/images/categories/tablet.webp" },
  { name: "Laptop", slug: "laptop", img: "/images/categories/laptop.webp" },
  { name: "Smartwatch", slug: "smart-watch", img: "/images/categories/smart-watch.webp" },
  { name: "Camera", slug: "camera", img: "/images/categories/camera.webp" },
  { name: "Console", slug: "game-console", img: "/images/categories/game-console.webp" },
];

function FeaturedTile({
  cat,
  priority = false,
}: {
  cat: (typeof categories)[number];
  priority?: boolean;
}) {
  return (
    <Link
      href={`/sell/${cat.slug}`}
      className="group relative w-56 h-44 sm:w-64 sm:h-52 md:w-72 md:h-56 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 ring-1 ring-border hover:ring-orange/40"
    >
      <img
        src={cat.img}
        alt={cat.name}
        width={640}
        height={640}
        className="absolute inset-0 z-[1] m-auto max-h-[78%] max-w-[85%] h-auto w-auto object-contain group-hover:scale-105 transition-transform duration-700"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-orange/70 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 z-[3] p-4">
        <p className="text-base font-semibold text-white group-hover:scale-105 origin-left transition-transform duration-300">
          Sell {cat.name}
        </p>
      </div>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="bg-cream py-12 sm:py-20 lg:py-28 overflow-hidden">
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

        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <FeaturedTile key={cat.slug} cat={cat} priority={i < 3} />
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

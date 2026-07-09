const quickLinks = [
  { label: "Sell iPhone", href: "/sell/phone/iphone" },
  { label: "Sell Samsung", href: "/sell/phone/samsung" },
  { label: "Sell iPad", href: "/sell/tablet/ipad" },
  { label: "Sell MacBook", href: "/sell/laptop/macbook" },
];

const categories = [
  { name: "Phone", slug: "phone", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80&fit=crop&auto=format" },
  { name: "Tablet", slug: "tablet", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80&fit=crop&auto=format" },
  { name: "Laptop", slug: "laptop", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&fit=crop&auto=format" },
  { name: "Desktop", slug: "desktop", img: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80&fit=crop&auto=format" },
  { name: "Smartwatch", slug: "smart-watch", img: "https://images.unsplash.com/photo-1546868871-af0de0ae72b5?w=600&q=80&fit=crop&auto=format" },
  { name: "Game Console", slug: "game-console", img: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&q=80&fit=crop&auto=format" },
  { name: "Graphics Card", slug: "graphics-card", img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80&fit=crop&auto=format" },
  { name: "Camera", slug: "camera", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80&fit=crop&auto=format" },
  { name: "Audio", slug: "audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&fit=crop&auto=format" },
  { name: "Drone", slug: "drone", img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&q=80&fit=crop&auto=format" },
  { name: "VR", slug: "vr", img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80&fit=crop&auto=format" },
  { name: "Monitor", slug: "monitor", img: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&q=80&fit=crop&auto=format" },
];

export function CategoryGrid() {
  return (
    <section className="bg-zinc-50 py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 animate-fade-in">
            Selling made simple
          </h2>
          <p className="mt-3 text-zinc-500 max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Find the device you&apos;d like to swap for cash.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`/sell/${cat.slug}`}
              className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                  Sell {cat.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

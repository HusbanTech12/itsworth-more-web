import { Card } from "@/components/ui/Card";

const quickLinks = [
  { label: "Sell iPhone", href: "/sell/iphone" },
  { label: "Sell Samsung", href: "/sell/samsung" },
  { label: "Sell iPad", href: "/sell/ipad" },
  { label: "Sell MacBook", href: "/sell/macbook" },
];

const categories = [
  { name: "Phone", slug: "phone", icon: "📱" },
  { name: "Tablet", slug: "tablet", icon: "📟" },
  { name: "Laptop", slug: "laptop", icon: "💻" },
  { name: "Desktop", slug: "desktop", icon: "🖥️" },
  { name: "Smartwatch", slug: "smart-watch", icon: "⌚" },
  { name: "Game Console", slug: "game-console", icon: "🎮" },
  { name: "Graphics Card", slug: "graphics-card", icon: "🎯" },
  { name: "Camera", slug: "camera", icon: "📷" },
  { name: "Audio", slug: "audio", icon: "🎧" },
  { name: "Drone", slug: "drone", icon: "🛸" },
  { name: "VR", slug: "vr", icon: "🥽" },
  { name: "Monitor", slug: "monitor", icon: "🖥️" },
];

export function CategoryGrid() {
  return (
    <section className="bg-zinc-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Selling made simple
          </h2>
          <p className="mt-3 text-zinc-500 max-w-md mx-auto">
            Find the device you&apos;d like to swap for cash.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <a key={cat.slug} href={`/sell/${cat.slug}`}>
              <Card padding="lg" className="text-center hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer h-full">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <p className="text-sm font-medium text-zinc-900">
                  Sell {cat.name}
                </p>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Card } from "@/components/ui/Card";
import { categories } from "@/lib/data";

const catImages: Record<string, string> = {
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80&fit=crop&auto=format",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80&fit=crop&auto=format",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80&fit=crop&auto=format",
  desktop: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=200&q=80&fit=crop&auto=format",
  "smart-watch": "https://images.unsplash.com/photo-1546868871-af0de0ae72b5?w=200&q=80&fit=crop&auto=format",
  "game-console": "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=200&q=80&fit=crop&auto=format",
  "graphics-card": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&q=80&fit=crop&auto=format",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80&fit=crop&auto=format",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80&fit=crop&auto=format",
  drone: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=200&q=80&fit=crop&auto=format",
  vr: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&q=80&fit=crop&auto=format",
  monitor: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=200&q=80&fit=crop&auto=format",
};

export default function SellPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Selling made simple
          </h1>
          <p className="mt-2 text-zinc-500">
            Find the device you&apos;d like to swap for cash.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          {[
            { label: "Sell iPhone", href: "/sell/phone/iphone" },
            { label: "Sell Samsung", href: "/sell/phone/samsung" },
            { label: "Sell iPad", href: "/sell/tablet/ipad" },
            { label: "Sell MacBook", href: "/sell/laptop/macbook" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <a key={cat.slug} href={`/sell/${cat.slug}`}>
              <Card padding="lg" className="text-center hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer h-full overflow-hidden" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-3 bg-zinc-100">
                    <img
                      src={catImages[cat.slug]}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">
                    Sell {cat.name.replace("Mobile ", "").replace("s$", "")}
                  </p>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

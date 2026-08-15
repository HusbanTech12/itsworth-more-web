import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sell Your Electronics for Cash | CashingTech",
  description: "Get an instant quote and sell your phone, tablet, laptop, and more for cash. Free shipping, fast payments, and great prices.",
};

const catImages: Record<string, string> = {
  phone: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  tablet: "/images/tablets/apple-ipad-pro-m4.jpg",
  laptop: "/images/laptops/apple-macbook-pro-16-m4.jpg",
  desktop: "/images/desktops/apple-imac-24-m4.jpg",
  "smart-watch": "/images/watches/apple-watch-ultra-3.jpg",
  "game-console": "/images/consoles/sony-playstation-5.jpg",
  "graphics-card": "/images/gpus/nvidia-geforce-rtx-4090.jpg",
  camera: "/images/cameras/leica-m11.jpg",
  audio: "/images/audio/apple-airpods-max-2.jpg",
  drone: "/images/drones/dji-mavic-4-pro.jpg",
  vr: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=3840&q=85&fit=crop&auto=format",
  monitor: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=3840&q=85&fit=crop&auto=format",
};

export default async function SellPage() {
  const cats = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.sortOrder);

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink font-heading">
                Categories
              </h1>
              <p className="text-sm text-ink-muted mt-1">
                Select a category to start selling
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {[
                { label: "iPhone", href: "/sell/phone/iphone" },
                { label: "Samsung", href: "/sell/phone/samsung" },
                { label: "iPad", href: "/sell/tablet/ipad" },
                { label: "MacBook", href: "/sell/laptop/macbook" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-ink-muted border border-border hover:bg-cream hover:text-orange transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {cats.map((cat) => (
            <Link
              key={cat.slug}
              href={`/sell/${cat.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-50 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={catImages[cat.slug] || `https://placehold.co/400x400?text=${cat.name[0]}`}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink group-hover:text-orange transition-colors">
                  {cat.name.replace("Mobile ", "")}
                </p>
                <p className="text-xs text-ink-muted/50 mt-0.5">Tap to sell &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

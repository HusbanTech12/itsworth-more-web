import Link from "next/link";
import Image from "next/image";
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
  phone: "/images/categories/phone.webp",
  tablet: "/images/categories/tablet.webp",
  laptop: "/images/categories/laptop.webp",
  desktop: "/images/categories/desktop.webp",
  "smart-watch": "/images/categories/smart-watch.webp",
  "game-console": "/images/categories/game-console.webp",
  "graphics-card": "/images/categories/graphics-card.webp",
  camera: "/images/categories/camera.webp",
  audio: "/images/categories/audio.webp",
  drone: "/images/categories/drone.webp",
  vr: "/images/categories/vr.webp",
  monitor: "/images/categories/monitor.webp",
};

export default async function SellPage() {
  const cats = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.sortOrder);

  return (
    <div className="bg-cream">
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
          {cats.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/sell/${cat.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-300"
            >
              <div className="relative aspect-square bg-white overflow-hidden">
                <Image
                  src={catImages[cat.slug] || `https://placehold.co/400x400/png?text=${cat.name[0]}`}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 160px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  priority={i < 4}
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

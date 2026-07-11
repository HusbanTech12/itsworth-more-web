import Link from "next/link";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const catImages: Record<string, string> = {
  phone: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=85&fit=crop&auto=format",
  laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=3840&q=85&fit=crop&auto=format",
  desktop: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=3840&q=85&fit=crop&auto=format",
  "smart-watch": "https://images.unsplash.com/photo-1664730021931-9abb25cb0852?w=3840&q=85&fit=crop&auto=format",
  "game-console": "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=3840&q=85&fit=crop&auto=format",
  "graphics-card": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=3840&q=85&fit=crop&auto=format",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=3840&q=85&fit=crop&auto=format",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=3840&q=85&fit=crop&auto=format",
  drone: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=3840&q=85&fit=crop&auto=format",
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
    <div className="min-h-screen bg-white">
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-serif">
                Categories
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
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
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-600 hover:bg-primary hover:text-white transition-all"
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
              className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-50 overflow-hidden">
                <img
                  src={catImages[cat.slug] || `https://placehold.co/400x400?text=${cat.name[0]}`}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">
                  {cat.name.replace("Mobile ", "")}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">Tap to sell &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

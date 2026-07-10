import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, brands, devices } from "@/db/schema";
import { eq } from "drizzle-orm";

const deviceImages: Record<string, string> = {
  "iphone-17-pro-max": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  "iphone-17-pro": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&q=85&fit=crop&auto=format",
  "iphone-17": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=3840&q=85&fit=crop&auto=format",
  "iphone-17e": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=3840&q=85&fit=crop&auto=format",
  "iphone-16-pro-max": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=3840&q=85&fit=crop&auto=format",
  "iphone-16-pro": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "iphone-16": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=3840&q=85&fit=crop&auto=format",
  "iphone-16-plus": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  "iphone-15-pro-max": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&q=85&fit=crop&auto=format",
  "iphone-15-pro": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=3840&q=85&fit=crop&auto=format",
  "iphone-15": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=3840&q=85&fit=crop&auto=format",
  "iphone-14-pro-max": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=3840&q=85&fit=crop&auto=format",
  "iphone-14": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=3840&q=85&fit=crop&auto=format",
  "iphone-13": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "iphone-13-mini": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=3840&q=85&fit=crop&auto=format",
  "iphone-12": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&q=85&fit=crop&auto=format",
  "iphone-se-3rd-gen": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s25-ultra": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s25-plus": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s25": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-s24-ultra": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-z-fold-6": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "galaxy-z-flip-6": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "pixel-9-pro": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "pixel-9": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  "ipad-pro-m4": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=85&fit=crop&auto=format",
  "ipad-air-m2": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=85&fit=crop&auto=format",
  "macbook-pro-16-m4": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=3840&q=85&fit=crop&auto=format",
  "macbook-air-15-m4": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=3840&q=85&fit=crop&auto=format",
};

export default async function BrandPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category, brand } = await params;

  let cat: typeof categories.$inferSelect | undefined;
  try {
    [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, category))
      .limit(1);
  } catch {
    throw new Error(`Failed to load category: ${category}`);
  }

  let br: typeof brands.$inferSelect | undefined;
  try {
    [br] = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, brand))
      .limit(1);
  } catch {
    throw new Error(`Failed to load brand: ${brand}`);
  }

  if (!cat || !br) notFound();

  let deviceList: (typeof devices.$inferSelect)[];
  try {
    deviceList = await db
      .select()
      .from(devices)
      .where(eq(devices.brandId, br.id))
      .orderBy(devices.sortOrder);
  } catch {
    throw new Error(`Failed to load devices for brand: ${brand}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
            <Link href="/sell" className="hover:text-zinc-600 transition-colors">Sell</Link>
            <span>/</span>
            <Link href={`/sell/${category}`} className="hover:text-zinc-600 transition-colors capitalize">
              {cat.name}
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">{br.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-serif">
            Sell your {br.name}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Select your device model to get an instant quote
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {deviceList.map((device) => (
            <Link
              key={device.slug}
              href={`/sell/${category}/${brand}/${device.slug}`}
              className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-50 overflow-hidden">
                <img
                  src={deviceImages[device.slug] || device.imageUrl || `https://placehold.co/400x400?text=${device.name[0]}`}
                  alt={device.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">
                  {device.name}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Up to <span className="text-primary font-medium">${((device.maxQuoteCents || 0) / 100).toLocaleString()}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

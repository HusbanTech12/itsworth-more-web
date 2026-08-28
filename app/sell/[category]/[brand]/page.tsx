import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, brands, devices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CatalogImage } from "@/components/shared/CatalogImage";
import { getBrandNewPricesForDevices } from "@/lib/pricing/brand-new-price";
import { formatPrice } from "@/lib/utils";

/** Non-phone/tablet/laptop fallbacks only — those categories use `devices.image_url`. */
const deviceImages: Record<string, string> = {};

export async function generateMetadata({ params }: { params: Promise<{ category: string; brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const [br] = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, brand))
    .limit(1)
    .catch(() => []);
  if (!br) return { title: "Sell Electronics | CashingTech" };
  return {
    title: `Sell ${br.name} for Cash | CashingTech`,
    description: br.metaDescription || `Get an instant quote and sell your ${br.name} for cash. Free shipping, fast payments.`,
  };
}

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

  const brandNewPrices = await getBrandNewPricesForDevices(
    deviceList.map((d) => d.id),
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted/50 mb-3">
            <Link href="/sell" className="hover:text-orange transition-colors">Sell</Link>
            <span>/</span>
            <Link href={`/sell/${category}`} className="hover:text-orange transition-colors capitalize">
              {cat.name}
            </Link>
            <span>/</span>
            <span className="text-ink font-medium min-w-0 truncate">{br.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink font-heading">
            Sell your {br.name}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Select your device model to get an instant quote
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {deviceList.map((device, i) => {
            const actualPriceCents = brandNewPrices.get(device.id);
            const displayPriceCents =
              actualPriceCents ?? device.maxQuoteCents ?? 0;

            return (
            <Link
              key={device.slug}
              href={`/sell/${category}/${brand}/${device.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-300"
            >
              <div className="aspect-square bg-white overflow-hidden flex items-center justify-center p-4">
                <CatalogImage
                  src={device.imageUrl || deviceImages[device.slug] || `https://placehold.co/400x400?text=${encodeURIComponent(device.name[0])}`}
                  alt={device.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  priority={i < 8}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink group-hover:text-orange transition-colors">
                  {device.name}
                </p>
                <p className="text-xs text-ink-muted/50 mt-0.5">
                  {actualPriceCents != null ? (
                    <span className="text-orange font-semibold">
                      {formatPrice(actualPriceCents)}
                    </span>
                  ) : displayPriceCents > 0 ? (
                    <>
                      Up to{" "}
                      <span className="text-orange font-medium">
                        {formatPrice(displayPriceCents)}
                      </span>
                    </>
                  ) : (
                    "Get quote"
                  )}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

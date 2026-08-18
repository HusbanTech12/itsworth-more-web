import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CatalogImage } from "@/components/shared/CatalogImage";

export const dynamic = "force-dynamic";

const brandImages: Record<string, string> = {
  iphone: "/images/phones/apple-iphone-17-pro-max.jpg",
  samsung: "/images/phones/samsung-galaxy-s25-ultra.jpg",
  "google-phone": "/images/phones/google-pixel-9-pro.jpg",
  oneplus: "/images/phones/oneplus-13.jpg",
  motorola: "/images/phones/motorola-moto-razr-plus-2024.jpg",
  ipad: "/images/tablets/apple-ipad-pro-m4.jpg",
  "samsung-tablet": "/images/tablets/samsung-galaxy-tab-s11-ultra.jpg",
  "oneplus-tablet": "/images/tablets/oneplus-pad-3.jpg",
  macbook: "/images/laptops/apple-macbook-pro-16-m4.jpg",
  "dell-laptop": "/images/laptops/dell-xps-16-2024.jpg",
  "hp-laptop": "/images/laptops/hp-spectre-x360-14.jpg",
  "lenovo-laptop": "/images/laptops/lenovo-thinkpad-x1-carbon-gen-12.jpg",
  "microsoft-laptop": "/images/laptops/microsoft-surface-laptop-7.jpg",
  "asus-laptop": "/images/laptops/asus-zenbook-14-oled.jpg",
  "acer-laptop": "/images/laptops/acer-swift-go-14.jpg",
  "samsung-laptop": "/images/laptops/samsung-galaxy-book6-pro.jpg",
  "razer-laptop": "/images/laptops/razer-blade-16.jpg",
  "apple-watch": "/images/watches/apple-watch-ultra-3.jpg",
  garmin: "/images/watches/garmin-fenix-8.jpg",
  "samsung-watch": "/images/watches/samsung-galaxy-watch8.jpg",
  "mac-mini": "/images/desktops/apple-mac-mini-2024-m4.jpg",
  imac: "/images/desktops/apple-imac-24-m4.jpg",
  "mac-studio": "/images/desktops/apple-mac-studio-m4-max.jpg",
  "mac-pro": "/images/desktops/apple-mac-pro-m2-ultra.jpg",
  lenovo: "/images/consoles/lenovo-legion-go-gen-2.jpg",
  msi: "/images/consoles/msi-claw-a8.jpg",
  valve: "/images/consoles/valve-steam-deck-oled.jpg",
  asus: "/images/consoles/asus-rog-ally-x.jpg",
  sony: "/images/consoles/sony-playstation-5.jpg",
  nintendo: "/images/consoles/nintendo-switch-2.jpg",
  xbox: "/images/consoles/xbox-series-x.jpg",
  evga: "/images/gpus/evga-rtx-3090-ftw3.jpg",
  "asus-gpu": "/images/gpus/asus-rog-xg-mobile-rtx-4090.jpg",
  nvidia: "/images/gpus/nvidia-geforce-rtx-4090.jpg",
  "amd-gpu": "/images/gpus/amd-radeon-rx-7900-xtx.jpg",
  nikon: "/images/cameras/nikon-z8.jpg",
  canon: "/images/cameras/canon-eos-r5-mark-ii.jpg",
  "sony-camera": "/images/cameras/sony-a7r-v.jpg",
  leica: "/images/cameras/leica-m11.jpg",
  fujifilm: "/images/cameras/fujifilm-x100vi.jpg",
  panasonic: "/images/cameras/panasonic-lumix-s5-ii.jpg",
  olympus: "/images/cameras/olympus-om-1-mark-ii.jpg",
  gopro: "/images/cameras/gopro-hero-13-black.jpg",
  "dji-camera": "/images/cameras/dji-osmo-pocket-3.jpg",
  "apple-audio": "/images/audio/apple-airpods-max-2.jpg",
  bose: "/images/audio/bose-qc-ultra-headphones-2.jpg",
  "sony-audio": "/images/audio/sony-wh-1000xm6.jpg",
  beats: "/images/audio/beats-studio-pro.jpg",
  dji: "/images/drones/dji-mavic-4-pro.jpg",
  autel: "/images/drones/autel-evo-lite-plus.jpg",
  "meta-vr": "/images/vr/meta-quest-3.jpg",
  "apple-vr": "/images/vr/apple-vision-pro.jpg",
  "valve-vr": "/images/vr/valve-index.jpg",
  "sony-vr": "/images/vr/sony-playstation-vr2.jpg",
  vive: "/images/vr/vive-xr-elite.jpg",
  "apple-display": "/images/monitors/apple-studio-display-27-2022.jpg",
  lg: "/images/monitors/lg-ultrafine-5k.jpg",
  "samsung-monitor": "/images/monitors/samsung-odyssey-g9.jpg",
  "dell-monitor": "/images/monitors/dell-ultrasharp-u2723qe.jpg",
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, category))
    .limit(1)
    .catch(() => []);
  if (!cat) {
    return { title: "Category | CashingTech" };
  }
  return {
    title: `Sell ${cat.name} for Cash | CashingTech`,
    description: cat.metaDescription || `Get an instant quote and sell your ${cat.name} for cash. Free shipping, fast payments.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

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

  if (!cat) notFound();

  let brandList: (typeof brands.$inferSelect)[];
  try {
    brandList = await db
      .select()
      .from(brands)
      .where(eq(brands.categoryId, cat.id))
      .orderBy(brands.sortOrder);
  } catch {
    throw new Error(`Failed to load brands for category: ${category}`);
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-xs text-ink-muted/50 mb-3">
            <Link href="/sell" className="hover:text-orange transition-colors">Sell</Link>
            <span>/</span>
            <span className="text-ink font-medium">{cat.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink font-heading">
            Sell {cat.name.replace("Mobile ", "")}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Choose a brand to see available devices
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {brandList.map((brand, i) => (
            <Link
              key={brand.slug}
              href={`/sell/${category}/${brand.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-300"
            >
              <div className="aspect-square bg-white overflow-hidden flex items-center justify-center p-4">
                <CatalogImage
                  src={brand.imageUrl || brandImages[brand.slug] || `https://placehold.co/400x400?text=${encodeURIComponent(brand.name[0])}`}
                  alt={brand.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  priority={i < 6}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink group-hover:text-orange transition-colors">
                  {brand.name}
                </p>
                <p className="text-xs text-ink-muted/50 mt-0.5">View devices &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

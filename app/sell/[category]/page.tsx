import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, brands } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const brandImages: Record<string, string> = {
  iphone: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&h=800&fit=crop&crop=center&auto=format&q=85",
  samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&crop=center&auto=format&q=85",
  "google-phone": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop&crop=center&auto=format&q=85",
  oneplus: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop&crop=center&auto=format&q=85",
  motorola: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop&v=0",
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
  "apple-watch": "https://images.pexels.com/photos/5083218/pexels-photo-5083218.jpeg?auto=compress&cs=tinysrgb&w=1920&fit=crop",
  "mac-mini": "/images/desktops/apple-mac-mini-2024-m4.jpg",
  imac: "/images/desktops/apple-imac-24-m4.jpg",
  "mac-studio": "/images/desktops/apple-mac-studio-m4-max.jpg",
  "mac-pro": "/images/desktops/apple-mac-pro-m2-ultra.jpg",
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
          {brandList.map((brand) => (
            <Link
              key={brand.slug}
              href={`/sell/${category}/${brand.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-300"
            >
              <div className={`aspect-square bg-cream overflow-hidden${category === "tablet" || category === "laptop" || category === "desktop" ? " flex items-center justify-center p-4" : ""}`}>
                <img
                  src={brand.imageUrl || brandImages[brand.slug] || `https://placehold.co/400x400?text=${encodeURIComponent(brand.name[0])}`}
                  alt={brand.name}
                  className={`w-full h-full ${category === "tablet" || category === "laptop" || category === "desktop" ? "object-contain" : "object-cover"} group-hover:scale-105 transition-transform duration-500`}
                  loading="lazy"
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

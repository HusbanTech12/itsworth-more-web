import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, brands } from "@/db/schema";
import { eq } from "drizzle-orm";

const brandImages: Record<string, string> = {
  iphone: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=3840&q=85&fit=crop&auto=format",
  samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=3840&q=85&fit=crop&auto=format",
  "google-phone": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=3840&q=85&fit=crop&auto=format",
  oneplus: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=3840&q=85&fit=crop&auto=format",
  motorola: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=3840&q=85&fit=crop&auto=format",
  ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=3840&q=85&fit=crop&auto=format",
  "samsung-tablet": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=3840&q=85&fit=crop&auto=format",
  macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=3840&q=85&fit=crop&auto=format",
  "apple-watch": "https://images.pexels.com/photos/5083218/pexels-photo-5083218.jpeg?auto=compress&cs=tinysrgb&w=1920&fit=crop",
};

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
              <div className="aspect-square bg-cream overflow-hidden">
                <img
                  src={brandImages[brand.slug] || brand.imageUrl || `https://placehold.co/400x400?text=${brand.name[0]}`}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

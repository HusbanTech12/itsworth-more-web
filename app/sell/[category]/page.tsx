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
  "apple-watch": "https://images.unsplash.com/photo-1546868871-af0de0ae72b5?w=3840&q=85&fit=crop&auto=format",
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, category))
    .limit(1);

  if (!cat) notFound();

  const brandList = await db
    .select()
    .from(brands)
    .where(eq(brands.categoryId, cat.id))
    .orderBy(brands.sortOrder);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
            <Link href="/sell" className="hover:text-zinc-600 transition-colors">Sell</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">{cat.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-serif">
            Sell {cat.name.replace("Mobile ", "")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
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
              className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="aspect-square bg-zinc-50 overflow-hidden">
                <img
                  src={brandImages[brand.slug] || brand.imageUrl || `https://placehold.co/400x400?text=${brand.name[0]}`}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">
                  {brand.name}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">View devices &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandCard } from "@/components/sell/BrandCard";
import { categories, getBrandsByCategory } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const brandList = getBrandsByCategory(category);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
          <Link href="/sell" className="hover:text-zinc-600 transition-colors">Sell</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">{cat.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-8">
          Sell your {cat.name.replace("Mobile ", "")}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brandList.map((brand) => (
            <BrandCard
              key={brand.slug}
              name={brand.name}
              slug={`${category}/${brand.slug}`}
              imageUrl={brand.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

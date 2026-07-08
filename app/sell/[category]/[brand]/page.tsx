import Link from "next/link";
import { notFound } from "next/navigation";
import { DeviceCard } from "@/components/sell/DeviceCard";
import { categories, brands, getDevicesByBrand } from "@/lib/data";

export function generateStaticParams() {
  const params: { category: string; brand: string }[] = [];
  for (const brand of brands) {
    const cat = categories.find((c) => c.slug === brand.categorySlug);
    if (cat) {
      params.push({ category: cat.slug, brand: brand.slug });
    }
  }
  return params;
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category, brand } = await params;
  const cat = categories.find((c) => c.slug === category);
  const br = brands.find((b) => b.slug === brand);
  if (!cat || !br) notFound();

  const deviceList = getDevicesByBrand(brand);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
          <Link href="/sell" className="hover:text-zinc-600 transition-colors">Sell</Link>
          <span>/</span>
          <Link href={`/sell/${category}`} className="hover:text-zinc-600 transition-colors">
            {cat.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">{br.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-8">
          Sell your {br.name}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {deviceList.map((device) => (
            <DeviceCard
              key={device.slug}
              name={device.name}
              slug={device.slug}
              imageUrl={device.imageUrl}
              brandSlug={`${category}/${brand}`}
              maxQuoteCents={device.maxQuoteCents}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

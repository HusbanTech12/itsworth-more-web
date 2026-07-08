import { NextResponse } from "next/server";
import { devices, brands, categories } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results = devices
    .filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q),
    )
    .slice(0, 8)
    .map((d) => {
      const brand = brands.find((b) => b.slug === d.brandSlug);
      const category = categories.find((c) => c.slug === brand?.categorySlug);
      return {
        label: `${d.name} — ${brand?.name ?? ""}`,
        href: `/${category?.slug ?? "phone"}/${brand?.slug ?? d.brandSlug}/${d.slug}`,
      };
    });

  return NextResponse.json({ results });
}

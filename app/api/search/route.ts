import { NextResponse } from "next/server";
import { db } from "@/db";
import { devices, brands, categories } from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${q}%`;

    const results = await db
      .select({
        slug: devices.slug,
        name: devices.name,
        imageUrl: devices.imageUrl,
        maxQuoteCents: devices.maxQuoteCents,
        brandSlug: brands.slug,
        brandName: brands.name,
        categorySlug: categories.slug,
        categoryName: categories.name,
      })
      .from(devices)
      .innerJoin(brands, eq(devices.brandId, brands.id))
      .innerJoin(categories, eq(brands.categoryId, categories.id))
      .where(
        and(
          eq(devices.isActive, true),
          ilike(devices.name, searchTerm),
        ),
      )
      .limit(8);

    const formatted = results.map((r) => ({
      label: `${r.name} — ${r.brandName}`,
      href: `/sell/${r.categorySlug}/${r.brandSlug}/${r.slug}`,
    }));

    return NextResponse.json({ results: formatted });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

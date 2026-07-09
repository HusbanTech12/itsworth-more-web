import { NextResponse } from "next/server";
import { db } from "@/db";
import { brands, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category.length) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const result = await db
    .select()
    .from(brands)
    .where(eq(brands.categoryId, category[0].id))
    .orderBy(brands.sortOrder);

  return NextResponse.json({ brands: result });
}

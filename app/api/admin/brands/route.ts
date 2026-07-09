import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { brands, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select({
        id: brands.id,
        categoryId: brands.categoryId,
        slug: brands.slug,
        name: brands.name,
        imageUrl: brands.imageUrl,
        sortOrder: brands.sortOrder,
        isActive: brands.isActive,
        metaTitle: brands.metaTitle,
        metaDescription: brands.metaDescription,
        createdAt: brands.createdAt,
        updatedAt: brands.updatedAt,
        categoryName: categories.name,
      })
      .from(brands)
      .leftJoin(categories, eq(brands.categoryId, categories.id))
      .orderBy(asc(brands.sortOrder));

    return NextResponse.json({ brands: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { categoryId, slug, name, imageUrl, sortOrder, isActive, metaTitle, metaDescription } = body;

    if (!categoryId || !slug || !name) {
      return NextResponse.json({ error: "Category ID, slug, and name are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(brands)
      .values({
        categoryId,
        slug,
        name,
        imageUrl,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
        metaTitle,
        metaDescription,
      })
      .returning();

    return NextResponse.json({ brand: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

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
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));
    return NextResponse.json({ categories: result });
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
    const { slug, name, icon, sortOrder, isActive, metaTitle, metaDescription } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug and name are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(categories)
      .values({
        slug,
        name,
        icon,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
        metaTitle,
        metaDescription,
      })
      .returning();

    return NextResponse.json({ category: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
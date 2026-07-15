import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { blogCategories } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select()
      .from(blogCategories)
      .orderBy(asc(blogCategories.sortOrder));
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
    const { slug, name, description, sortOrder } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug and name are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(blogCategories)
      .values({
        slug,
        name,
        description,
        sortOrder: sortOrder ?? 0,
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

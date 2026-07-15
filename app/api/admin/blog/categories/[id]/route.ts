import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { blogCategories, blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const [result] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, parseInt(id)));

    if (!result) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const [result] = await db
      .update(blogCategories)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(blogCategories.id, parseInt(id)))
      .returning();

    return NextResponse.json({ category: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [existing] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await db
      .update(blogPosts)
      .set({ categoryId: null })
      .where(eq(blogPosts.categoryId, parseInt(id)));

    await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

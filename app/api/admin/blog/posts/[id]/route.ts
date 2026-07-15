import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const [result] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)));

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: result });
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
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...body, updatedAt: new Date() };

    if (body.publishedAt) {
      updateData.publishedAt = new Date(body.publishedAt);
    }

    const [result] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json({ post: result });
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
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

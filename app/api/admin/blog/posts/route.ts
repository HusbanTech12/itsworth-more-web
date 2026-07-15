import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { blogPosts, blogCategories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const rows = await db
      .select()
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .orderBy(desc(blogPosts.createdAt));

    const posts = rows.map((row) => ({
      ...row.blog_posts,
      blogCategories: row.blog_categories,
    }));

    return NextResponse.json({ posts });
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
    const { slug, title, excerpt, content, imageUrl, author, categoryId, publishedAt, isFeatured, isPublished, metaTitle, metaDescription } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Slug, title, and content are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(blogPosts)
      .values({
        slug,
        title,
        excerpt,
        content,
        imageUrl,
        author: author || "Admin",
        categoryId: categoryId || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        isFeatured: isFeatured ?? false,
        isPublished: isPublished ?? false,
        metaTitle,
        metaDescription,
      })
      .returning();

    return NextResponse.json({ post: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

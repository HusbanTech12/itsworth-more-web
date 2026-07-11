import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { newsletterSubscriptions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select()
      .from(newsletterSubscriptions)
      .orderBy(desc(newsletterSubscriptions.createdAt));

    return NextResponse.json({ subscriptions: result });
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
    const { email, locale, isActive } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [result] = await db
      .insert(newsletterSubscriptions)
      .values({
        email,
        locale: locale ?? "en",
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json({ subscription: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
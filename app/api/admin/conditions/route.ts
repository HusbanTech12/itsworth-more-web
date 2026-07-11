import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { deviceConditions } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select()
      .from(deviceConditions)
      .orderBy(asc(deviceConditions.sortOrder));

    return NextResponse.json({ conditions: result });
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
    const { slug, label, description, isBulk, isRetail, sortOrder } = body;

    if (!slug || !label) {
      return NextResponse.json({ error: "Slug and label are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(deviceConditions)
      .values({
        slug,
        label,
        description,
        isBulk: isBulk ?? false,
        isRetail: isRetail ?? true,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json({ condition: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
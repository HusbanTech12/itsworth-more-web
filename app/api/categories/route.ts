import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);

    return NextResponse.json({ categories: result });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

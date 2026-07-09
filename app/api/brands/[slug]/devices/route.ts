import { NextResponse } from "next/server";
import { db } from "@/db";
import { devices, brands } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const brand = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, slug))
    .limit(1);

  if (!brand.length) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  const result = await db
    .select()
    .from(devices)
    .where(eq(devices.brandId, brand[0].id))
    .orderBy(devices.sortOrder);

  return NextResponse.json({ devices: result });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { devices, brands } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select({
        id: devices.id,
        brandId: devices.brandId,
        slug: devices.slug,
        name: devices.name,
        imageUrl: devices.imageUrl,
        maxQuoteCents: devices.maxQuoteCents,
        sortOrder: devices.sortOrder,
        isActive: devices.isActive,
        metaTitle: devices.metaTitle,
        metaDescription: devices.metaDescription,
        createdAt: devices.createdAt,
        updatedAt: devices.updatedAt,
        brandName: brands.name,
      })
      .from(devices)
      .leftJoin(brands, eq(devices.brandId, brands.id))
      .orderBy(asc(devices.sortOrder));

    return NextResponse.json({ devices: result });
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
    const { brandId, slug, name, imageUrl, maxQuoteCents, sortOrder, isActive, metaTitle, metaDescription } = body;

    if (!brandId || !slug || !name) {
      return NextResponse.json({ error: "Brand ID, slug, and name are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(devices)
      .values({
        brandId,
        slug,
        name,
        imageUrl,
        maxQuoteCents,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
        metaTitle,
        metaDescription,
      })
      .returning();

    return NextResponse.json({ device: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
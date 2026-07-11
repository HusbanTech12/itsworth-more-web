import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { bulkQuoteRequests, bulkQuoteItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [request] = await db
      .select()
      .from(bulkQuoteRequests)
      .where(eq(bulkQuoteRequests.id, parseInt(id)));

    if (!request) {
      return NextResponse.json({ error: "Bulk quote not found" }, { status: 404 });
    }

    const items = await db
      .select()
      .from(bulkQuoteItems)
      .where(eq(bulkQuoteItems.requestId, request.id));

    return NextResponse.json({ bulkQuote: { ...request, items } });
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
      .from(bulkQuoteRequests)
      .where(eq(bulkQuoteRequests.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Bulk quote not found" }, { status: 404 });
    }

    const allowedFields = ["status", "name", "companyName", "email", "phone", "comments"];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const [result] = await db
      .update(bulkQuoteRequests)
      .set(updateData)
      .where(eq(bulkQuoteRequests.id, parseInt(id)))
      .returning();

    return NextResponse.json({ bulkQuote: result });
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
      .from(bulkQuoteRequests)
      .where(eq(bulkQuoteRequests.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Bulk quote not found" }, { status: 404 });
    }

    await db.delete(bulkQuoteItems).where(eq(bulkQuoteItems.requestId, parseInt(id)));
    await db.delete(bulkQuoteRequests).where(eq(bulkQuoteRequests.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
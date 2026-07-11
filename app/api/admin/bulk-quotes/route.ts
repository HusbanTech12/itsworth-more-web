import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { bulkQuoteRequests, bulkQuoteItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select()
      .from(bulkQuoteRequests)
      .orderBy(desc(bulkQuoteRequests.createdAt));

    const withItems = await Promise.all(
      result.map(async (request) => {
        const items = await db
          .select()
          .from(bulkQuoteItems)
          .where(eq(bulkQuoteItems.requestId, request.id));
        return { ...request, items };
      }),
    );

    return NextResponse.json({ bulkQuotes: withItems });
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
    const { name, companyName, email, phone, specsFileUrl, comments, type, status, items } = body;

    if (!name || !email || !type) {
      return NextResponse.json({ error: "Name, email, and type are required" }, { status: 400 });
    }

    const [requestResult] = await db
      .insert(bulkQuoteRequests)
      .values({
        name,
        companyName,
        email,
        phone,
        specsFileUrl,
        comments,
        type,
        status: status ?? "new",
      })
      .returning();

    if (items && Array.isArray(items)) {
      await db.insert(bulkQuoteItems).values(
        items.map((item: { productName: string; quantity: number; conditionSlug?: string; category?: string; specs?: string }) => ({
          requestId: requestResult.id,
          productName: item.productName,
          quantity: item.quantity,
          conditionSlug: item.conditionSlug,
          category: item.category,
          specs: item.specs,
        })),
      );
    }

    return NextResponse.json({ bulkQuote: requestResult }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
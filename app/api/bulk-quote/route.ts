import { NextResponse } from "next/server";
import { db } from "@/db";
import { bulkQuoteRequests, bulkQuoteItems } from "@/db/schema";
import { sendBulkQuoteNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, companyName, email, phone, specsFileUrl, comments, items } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const [request] = await db
      .insert(bulkQuoteRequests)
      .values({
        name,
        companyName,
        email,
        phone,
        specsFileUrl,
        comments,
        type: "bulk",
      })
      .returning();

    if (items?.length) {
      await db.insert(bulkQuoteItems).values(
        items.map((item: { productName: string; quantity: number; conditionSlug?: string; category?: string; specs?: string }) => ({
          requestId: request.id,
          productName: item.productName,
          quantity: item.quantity,
          conditionSlug: item.conditionSlug,
          category: item.category,
          specs: item.specs,
        })),
      );
    }

    await sendBulkQuoteNotification({
      name,
      companyName,
      email,
      phone,
      comments,
      type: "bulk",
      items: items?.map((i: { productName: string; quantity: number }) => ({ productName: i.productName, quantity: i.quantity })),
    }).catch(() => {});

    return NextResponse.json(
      { success: true, requestId: request.id },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

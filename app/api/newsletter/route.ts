import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscriptions } from "@/db/schema";
import { sendNewsletterConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, locale } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const [subscription] = await db
      .insert(newsletterSubscriptions)
      .values({
        email: email.toLowerCase().trim(),
        locale: locale || "en",
      })
      .onConflictDoNothing()
      .returning();

    if (subscription) {
      await sendNewsletterConfirmation(email).catch(() => {});
    }

    return NextResponse.json(
      { success: true, subscribed: !!subscription },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

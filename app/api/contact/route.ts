import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await db.insert(contactMessages).values({
      name,
      email,
      subject,
      message,
    });

    await sendContactNotification({ name, email, subject, message }).catch((e) => { console.error("Email send failed:", e); });

    return NextResponse.json(
      { success: true, message: "Message received" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/db";
import { users, newsletterSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let evt: { type: string; data: Record<string, unknown> };

  try {
    const wh = new Webhook(webhookSecret);
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (evt.type) {
    case "user.created": {
      const data = evt.data as {
        id: string;
        email_addresses?: Array<{ email_address: string }>;
        first_name?: string;
        last_name?: string;
        image_url?: string;
      };

      const email = data.email_addresses?.[0]?.email_address?.toLowerCase();
      await db.insert(users).values({
        id: data.id,
        email,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        role: email === "husbantech08@gmail.com" ? "admin" : "user",
      }).onConflictDoNothing();

      if (email) {
        await db
          .insert(newsletterSubscriptions)
          .values({ email, locale: "en" })
          .onConflictDoNothing();
      }
      break;
    }
    case "user.updated": {
      const data = evt.data as {
        id: string;
        email_addresses?: Array<{ email_address: string }>;
        first_name?: string;
        last_name?: string;
        image_url?: string;
      };

      const updatedEmail = data.email_addresses?.[0]?.email_address?.toLowerCase();
      await db.update(users).set({
        email: updatedEmail,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        role: updatedEmail === "husbantech08@gmail.com" ? "admin" : "user",
        updatedAt: new Date(),
      }).where(eq(users.id, data.id));
      break;
    }
    case "user.deleted": {
      const { id } = evt.data as { id: string };
      await db.update(users).set({
        isActive: false,
        updatedAt: new Date(),
      }).where(eq(users.id, id));
      break;
    }
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const [result] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)));

    if (!result) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: result });
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
      .from(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const [result] = await db
      .update(contactMessages)
      .set({ isRead: body.isRead ?? true })
      .where(eq(contactMessages.id, parseInt(id)))
      .returning();

    return NextResponse.json({ message: result });
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
      .from(contactMessages)
      .where(eq(contactMessages.id, parseInt(id)));

    if (!existing) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await db.delete(contactMessages).where(eq(contactMessages.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
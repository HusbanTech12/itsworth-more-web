import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const result = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ users: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, email, firstName, lastName, imageUrl } = body;

    if (!id || !email) {
      return NextResponse.json({ error: "id and email are required" }, { status: 400 });
    }

    const result = await db
      .insert(users)
      .values({
        id,
        email: email.toLowerCase(),
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        imageUrl: imageUrl ?? null,
      })
      .onConflictDoNothing()
      .returning();

    return NextResponse.json({ user: result[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
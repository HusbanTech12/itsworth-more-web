import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ items: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, item: body }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

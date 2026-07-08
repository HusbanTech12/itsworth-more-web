import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params;
  return NextResponse.json({ success: true, itemId });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params;
  return NextResponse.json({ success: true, itemId });
}

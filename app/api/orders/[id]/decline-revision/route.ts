import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    message: `Revised offer declined for order ${id}. Device will be returned.`,
  });
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, subtotalCents } = await req.json();

    const mockCoupons: Record<string, {
      code: string;
      type: "percentage" | "fixed";
      value: number;
      discountCents: number;
    }> = {
      "468XOR38": {
        code: "468XOR38",
        type: "percentage",
        value: 5,
        discountCents: Math.round(subtotalCents * 0.05),
      },
      "SAVE10": {
        code: "SAVE10",
        type: "percentage",
        value: 10,
        discountCents: Math.round(subtotalCents * 0.1),
      },
      "FLAT25": {
        code: "FLAT25",
        type: "fixed",
        value: 2500,
        discountCents: 2500,
      },
    };

    const coupon = mockCoupons[code.toUpperCase()];

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code" },
        { status: 404 },
      );
    }

    return NextResponse.json({ coupon });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

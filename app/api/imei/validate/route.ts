import { NextResponse } from "next/server";
import { validateImei } from "@/lib/imei";

/**
 * Format + Luhn check. A live TAC/blacklist provider can be added later
 * without changing this response shape.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = validateImei(body.imei);

    if (!result.ok) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true, imei: result.imei });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

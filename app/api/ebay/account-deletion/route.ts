import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

function getEndpointUrl(req: NextRequest): string {
  return (
    process.env.EBAY_DELETION_ENDPOINT_URL ??
    `${req.nextUrl.origin}/api/ebay/account-deletion`
  );
}

// eBay validates this endpoint with GET ?challenge_code=... before enabling
// production keysets. Must answer with sha256(challengeCode + token + endpointUrl).
export async function GET(req: NextRequest) {
  const challengeCode = req.nextUrl.searchParams.get("challenge_code");
  if (!challengeCode) {
    return NextResponse.json({ error: "Missing challenge_code" }, { status: 400 });
  }
  const verificationToken = process.env.EBAY_DELETION_VERIFICATION_TOKEN;
  if (!verificationToken) {
    return NextResponse.json(
      { error: "EBAY_DELETION_VERIFICATION_TOKEN is not configured" },
      { status: 503 },
    );
  }

  const challengeResponse = createHash("sha256")
    .update(challengeCode + verificationToken + getEndpointUrl(req))
    .digest("hex");

  return NextResponse.json({ challengeResponse });
}

// eBay sends Marketplace Account Deletion/Closure notifications here.
// This app never requests eBay user tokens, so eBay holds no user data for us —
// acknowledging receipt is sufficient for compliance.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body?.notification?.data?.username;
    console.log("[ebay] account deletion notification received", {
      username,
      userId: body?.notification?.data?.userId,
      date: body?.notification?.eventDate,
    });
  } catch {
    // Malformed payload — still acknowledge so eBay doesn't retry forever
  }
  return new NextResponse(null, { status: 200 });
}

import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-orders";

export async function GET() {
  return NextResponse.json({ orders: mockOrders });
}

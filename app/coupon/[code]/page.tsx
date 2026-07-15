import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Apply Coupon | CashingTech",
  description: "Apply your promo code for extra savings on your electronics trade-in.",
};

export default async function CouponPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  // Temporary: redirect to box with coupon param (client-side will apply it)
  redirect(`/sell/box?coupon=${code}`);
}

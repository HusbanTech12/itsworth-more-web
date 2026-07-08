import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CouponPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  // Temporary: redirect to box with coupon param (client-side will apply it)
  redirect(`/sell/box?coupon=${code}`);
}

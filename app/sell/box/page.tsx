"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BoxItemCard } from "@/components/box/BoxItem";
import { CouponInput } from "@/components/box/CouponInput";
import { BoxSummary } from "@/components/box/BoxSummary";
import { useBox } from "@/context/BoxContext";

function BoxContent() {
  const { items, removeItem, subtotalCents, discountCents, totalCents, itemCount, clearBox, applyCoupon, coupon } = useBox();
  const searchParams = useSearchParams();

  useEffect(() => {
    const couponCode = searchParams.get("coupon");
    if (couponCode && !coupon) {
      applyCoupon(couponCode);
    }
  }, [searchParams, coupon, applyCoupon]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
          My Box ({itemCount})
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearBox}
            className="text-sm text-zinc-500 hover:text-red-600 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your Box is empty"
          description="Add items to get started."
          action={
            <Link href="/sell">
              <Button variant="primary" size="lg">
                Start Selling
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <BoxItemCard
                key={item.id}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="space-y-4">
            <CouponInput />
            <BoxSummary
              subtotalCents={subtotalCents}
              discountCents={discountCents}
              totalCents={totalCents}
              itemCount={itemCount}
            />
            <Link
              href="/sell/box/checkout"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-primary text-white hover:bg-primary-dark active:bg-primary-dark focus-visible:ring-primary/50 h-12 px-6 text-base gap-2 w-full"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 focus-visible:ring-zinc-900/50 h-10 px-4 text-sm gap-2 w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BoxPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Suspense fallback={null}>
        <BoxContent />
      </Suspense>
    </div>
  );
}

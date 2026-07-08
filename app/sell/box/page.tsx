"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BoxItemCard } from "@/components/box/BoxItem";
import { CouponInput } from "@/components/box/CouponInput";
import { BoxSummary } from "@/components/box/BoxSummary";
import { useBox } from "@/context/BoxContext";

export default function BoxPage() {
  const { items, removeItem, subtotalCents, discountCents, totalCents, itemCount, clearBox } = useBox();

  return (
    <div className="min-h-screen bg-zinc-50">
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
              <Link href="/sell/box/checkout">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" size="md" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

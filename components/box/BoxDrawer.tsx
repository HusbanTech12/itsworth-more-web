"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BoxItemCard } from "./BoxItem";
import { CouponInput } from "./CouponInput";
import { BoxSummary } from "./BoxSummary";
import { useBox } from "@/context/BoxContext";

interface BoxDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function BoxDrawer({ open, onClose }: BoxDrawerProps) {
  const { items, removeItem, subtotalCents, discountCents, totalCents, itemCount } = useBox();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            My Box ({mounted ? itemCount : 0})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-64px)]">
          {!mounted ? (
            <div className="flex-1" />
          ) : items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6">
              <EmptyState
                title="Your Box is empty"
                description="Add items to get started."
                action={
                  <Link href="/sell">
                    <Button variant="primary" size="md">
                      Start Selling
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {items.map((item) => (
                  <BoxItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <div className="border-t border-zinc-200 px-6 py-4 space-y-4">
                <CouponInput />
                <BoxSummary
                  subtotalCents={subtotalCents}
                  discountCents={discountCents}
                  totalCents={totalCents}
                  itemCount={itemCount}
                />
                <div className="flex gap-3">
                  <Link href="/sell/box" className="flex-1" onClick={onClose}>
                    <Button variant="outline" size="md" className="w-full">
                      View Box
                    </Button>
                  </Link>
                  <Link href="/sell/box/checkout" className="flex-1" onClick={onClose}>
                    <Button variant="primary" size="md" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

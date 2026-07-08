"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useBox } from "@/context/BoxContext";

export function CouponInput() {
  const { coupon, applyCoupon, removeCoupon } = useBox();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const ok = await applyCoupon(code.trim().toUpperCase());
    setLoading(false);
    if (ok) {
      setCode("");
    } else {
      setError("Invalid or expired coupon code");
    }
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Coupon applied: <strong>{coupon.code}</strong>
          </p>
          <p className="text-xs text-emerald-600 mt-0.5">
            {coupon.type === "percentage"
              ? `${coupon.value}% off`
              : `$${(coupon.value / 100).toFixed(2)} off`}
          </p>
        </div>
        <button
          onClick={removeCoupon}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          error={error}
        />
      </div>
      <Button
        variant="outline"
        size="md"
        onClick={handleApply}
        loading={loading}
        disabled={!code.trim()}
      >
        Apply
      </Button>
    </div>
  );
}

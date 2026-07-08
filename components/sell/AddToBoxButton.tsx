"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AddToBoxButtonProps {
  conditionSlug: string;
  onAdded?: () => void;
}

export function AddToBoxButton({
  conditionSlug,
  onAdded,
}: AddToBoxButtonProps) {
  const [added, setAdded] = useState(false);

  if (!conditionSlug) return null;

  function handleAdd() {
    setAdded(true);
    onAdded?.();
  }

  if (added) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-emerald-700">
            Added to your Box!
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => window.location.href = "/sell"}
          >
            Continue Shopping
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => window.location.href = "/sell/box"}
          >
            View Box
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="lg"
      variant="primary"
      className="w-full"
      disabled={!conditionSlug}
      onClick={handleAdd}
    >
      Add to Box
    </Button>
  );
}

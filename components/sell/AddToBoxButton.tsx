"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { useBox } from "@/context/BoxContext";

interface AddToBoxButtonProps {
  deviceId: number;
  deviceName: string;
  deviceSlug: string;
  conditionSlug: string;
  conditionLabel?: string;
  offeredPriceCents: number;
  hasAccessories?: boolean;
  imei?: string;
  serialNumber?: string;
  imageUrl?: string;
}

export function AddToBoxButton({
  deviceId,
  deviceName,
  deviceSlug,
  conditionSlug,
  conditionLabel,
  offeredPriceCents,
  hasAccessories,
  imei,
  serialNumber,
  imageUrl,
}: AddToBoxButtonProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { addItem, refreshFromServer } = useBox();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!conditionSlug) return null;

  async function handleAdd() {
    setState("loading");
    setErrorMsg("");

    const localPayload = {
      deviceSlug,
      deviceName,
      conditionSlug,
      conditionLabel: conditionLabel || conditionSlug,
      priceCents: offeredPriceCents,
      imageUrl,
    };

    try {
      if (!isSignedIn) {
        // Guest box — local only; sign-in required at checkout
        addItem(localPayload);
        setState("added");
        return;
      }

      const res = await fetch("/api/box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          deviceName,
          conditionSlug,
          conditionLabel: conditionLabel || conditionSlug,
          offeredPriceCents,
          hasAccessories,
          imei: imei || undefined,
          serialNumber: serialNumber || undefined,
          imageUrl,
        }),
      });

      if (res.status === 401) {
        addItem(localPayload);
        setState("added");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add to box");
      }

      await refreshFromServer();
      setState("added");
    } catch (e) {
      setState("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (state === "added") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-emerald-700">Added to your Box!</p>
        </div>
        {!isSignedIn && (
          <p className="text-xs text-ink-muted text-center">
            Sign in at checkout to submit your offer.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/sell")}
          >
            Continue Shopping
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/sell/box")}
          >
            View Box
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button
        size="lg"
        variant="primary"
        className="w-full"
        disabled={!conditionSlug || state === "loading"}
        onClick={handleAdd}
      >
        {state === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Adding...
          </span>
        ) : (
          "Add to Box"
        )}
      </Button>
      {state === "error" && (
        <p className="text-xs text-red-600 mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  );
}

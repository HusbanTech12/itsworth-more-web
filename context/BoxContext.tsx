"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";

export interface BoxItem {
  id: string;
  deviceSlug: string;
  deviceName: string;
  conditionSlug: string;
  conditionLabel: string;
  priceCents: number;
  imageUrl?: string;
  /** Server order_items.id when synced */
  serverItemId?: number;
}

interface AppliedCoupon {
  code: string;
  discountCents: number;
  type: "percentage" | "fixed";
  value: number;
}

interface BoxContextValue {
  items: BoxItem[];
  coupon: AppliedCoupon | null;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  itemCount: number;
  hydrated: boolean;
  addItem: (item: Omit<BoxItem, "id">) => void;
  removeItem: (id: string) => void | Promise<void>;
  clearBox: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  refreshFromServer: () => Promise<void>;
}

const STORAGE_KEY = "cashingtech_box";
const COUPON_KEY = "cashingtech_coupon";

const BoxContext = createContext<BoxContextValue | null>(null);

function readLocalItems(): BoxItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readLocalCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function BoxProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [items, setItems] = useState<BoxItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const persistItems = useCallback((updated: BoxItem[]) => {
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const refreshFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/box");
      if (!res.ok) return;
      const data = await res.json();
      const mapped: BoxItem[] = (data.items || []).map(
        (row: {
          id: number;
          deviceName: string;
          conditionSlug: string;
          conditionLabel: string | null;
          offeredPriceCents: number;
          imageUrl?: string | null;
        }) => ({
          id: `srv_${row.id}`,
          serverItemId: row.id,
          deviceSlug: "",
          deviceName: row.deviceName,
          conditionSlug: row.conditionSlug,
          conditionLabel: row.conditionLabel || row.conditionSlug,
          priceCents: row.offeredPriceCents,
          imageUrl: row.imageUrl || undefined,
        }),
      );
      // Prefer server when signed in — single source of truth
      persistItems(mapped);
    } catch {
      // keep local
    }
  }, [persistItems]);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    (async () => {
      const localItems = readLocalItems();
      const localCoupon = readLocalCoupon();
      if (!cancelled) {
        setCoupon(localCoupon);
        if (!isSignedIn) {
          setItems(localItems);
          setHydrated(true);
          return;
        }
        try {
          const res = await fetch("/api/box");
          if (res.ok) {
            const data = await res.json();
            const mapped: BoxItem[] = (data.items || []).map(
              (row: {
                id: number;
                deviceName: string;
                conditionSlug: string;
                conditionLabel: string | null;
                offeredPriceCents: number;
                imageUrl?: string | null;
              }) => ({
                id: `srv_${row.id}`,
                serverItemId: row.id,
                deviceSlug: "",
                deviceName: row.deviceName,
                conditionSlug: row.conditionSlug,
                conditionLabel: row.conditionLabel || row.conditionSlug,
                priceCents: row.offeredPriceCents,
                imageUrl: row.imageUrl || undefined,
              }),
            );
            // Keep guest-only local items if server box is empty
            const guestOnly = localItems.filter((i) => !i.serverItemId);
            persistItems(
              mapped.length > 0 ? mapped : guestOnly.length > 0 ? guestOnly : [],
            );
          } else {
            setItems(localItems);
          }
        } catch {
          if (!cancelled) setItems(localItems);
        }
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, refreshFromServer]);

  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents, 0);

  let discountCents = 0;
  if (coupon) {
    if (coupon.type === "percentage") {
      discountCents = Math.round(subtotalCents * (coupon.value / 100));
    } else {
      discountCents = coupon.value;
    }
    discountCents = Math.min(discountCents, subtotalCents);
  }

  const totalCents = subtotalCents - discountCents;
  const itemCount = items.length;

  const addItem = useCallback(
    (item: Omit<BoxItem, "id">) => {
      const id = `box_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const next = [...items, { ...item, id }];
      persistItems(next);
    },
    [items, persistItems],
  );

  const removeItem = useCallback(
    async (id: string) => {
      const target = items.find((i) => i.id === id);
      const next = items.filter((i) => i.id !== id);
      persistItems(next);
      if (target?.serverItemId) {
        await fetch(`/api/box/${target.serverItemId}`, { method: "DELETE" }).catch(
          () => {},
        );
      }
    },
    [items, persistItems],
  );

  const clearBox = useCallback(() => {
    persistItems([]);
    setCoupon(null);
    localStorage.removeItem(COUPON_KEY);
  }, [persistItems]);

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotalCents }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setCoupon(data.coupon);
      localStorage.setItem(COUPON_KEY, JSON.stringify(data.coupon));
      return true;
    },
    [subtotalCents],
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    localStorage.removeItem(COUPON_KEY);
  }, []);

  return (
    <BoxContext.Provider
      value={{
        items,
        coupon,
        subtotalCents,
        discountCents,
        totalCents,
        itemCount,
        hydrated,
        addItem,
        removeItem,
        clearBox,
        applyCoupon,
        removeCoupon,
        refreshFromServer,
      }}
    >
      {children}
    </BoxContext.Provider>
  );
}

export function useBox() {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error("useBox must be used within a BoxProvider");
  return ctx;
}

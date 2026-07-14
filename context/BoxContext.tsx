"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface BoxItem {
  id: string;
  deviceSlug: string;
  deviceName: string;
  conditionSlug: string;
  conditionLabel: string;
  priceCents: number;
  imageUrl?: string;
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
  addItem: (item: Omit<BoxItem, "id">) => void;
  removeItem: (id: string) => void;
  clearBox: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const STORAGE_KEY = "cashingtech_box";
const COUPON_KEY = "cashingtech_coupon";

const BoxContext = createContext<BoxContextValue | null>(null);

export function BoxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BoxItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<AppliedCoupon | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(COUPON_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const persistItems = useCallback(
    (next: BoxItem[] | ((prev: BoxItem[]) => BoxItem[])) => {
      setItems((prev) => {
        const updated = typeof next === "function" ? next(prev) : next;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

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
      persistItems((prev) => [...prev, { ...item, id }]);
    },
    [persistItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      persistItems((prev) => prev.filter((i) => i.id !== id));
    },
    [persistItems],
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
        addItem,
        removeItem,
        clearBox,
        applyCoupon,
        removeCoupon,
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

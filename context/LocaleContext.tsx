"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type Locale = "en" | "en-GB";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  formatPrice: (cents: number) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "itsworthmore_locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "en-GB") return stored;
    } catch {}
    return "en";
  });

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const formatPrice = useCallback(
    (cents: number) => {
      const currency = locale === "en-GB" ? "GBP" : "USD";
      const localeStr = locale === "en-GB" ? "en-GB" : "en-US";
      return new Intl.NumberFormat(localeStr, {
        style: "currency",
        currency,
      }).format(cents / 100);
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, formatPrice }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

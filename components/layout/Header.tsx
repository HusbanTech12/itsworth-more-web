"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BoxDrawer } from "@/components/box/BoxDrawer";
import { useBox } from "@/context/BoxContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navLinks = [
  { label: "Start Selling", href: "/sell" },
  { label: "Sell In Bulk", href: "/bulk-trade-in" },
  { label: "Buy Refurbished", href: "https://buy.itsworthmore.com" },
  { label: "Support", href: "/support" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [locale, setLocale] = useState<"en" | "en-GB">("en");
  const { itemCount } = useBox();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-white text-sm font-bold">
              I
            </div>
            <span className="text-lg font-bold text-zinc-900 hidden sm:inline">
              ItsWorthMore
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} onToggle={setLocale} />
            </div>

            <a
              href="/sign-in"
              className="hidden sm:inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Login
            </a>

            <button onClick={() => setDrawerOpen(true)} className="relative">
              <Button size="sm" variant="primary">
                My Box
                {itemCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-white/20 text-white text-xs font-bold px-1">
                    {itemCount}
                  </span>
                )}
              </Button>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" />
                ) : (
                  <path d="M3 5h14M3 10h14M3 15h14" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-zinc-100">
              <a
                href="/sign-in"
                className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Login
              </a>
            </div>
            <div className="pt-2">
              <LanguageSwitcher locale={locale} onToggle={setLocale} />
            </div>
          </div>
        )}
      </header>

      <BoxDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { BoxDrawer } from "@/components/box/BoxDrawer";
import { DeviceSearch } from "@/components/shared/DeviceSearch";
import { useBox } from "@/context/BoxContext";
import { useLocale } from "@/context/LocaleContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { label: "Start Selling", href: "/sell" },
  { label: "Sell In Bulk", href: "/bulk-trade-in" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { itemCount } = useBox();
  const { locale, setLocale } = useLocale();
  const { isSignedIn, user } = useUser();
  const adminEmail = "husbantech08@gmail.com";
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
              <defs>
                <linearGradient id="hGrad" x1="0.2" y1="0.8" x2="0.8" y2="0.2">
                  <stop offset="0%" stopColor="#2563eb"/>
                  <stop offset="100%" stopColor="#60a5fa"/>
                </linearGradient>
              </defs>
              <path d="M 16,3 L 29,16 L 16,29 L 3,16 Z" fill="url(#hGrad)"/>
              <path d="M 16,3 L 29,16 L 16,16 Z" fill="#93c5fd" opacity="0.4"/>
              <path d="M 12,20 L 15,17 L 13.5,17 L 13.5,12 L 18.5,12 L 18.5,16 L 17,16 L 19.5,19.5 L 17,22 L 15.5,20.5 L 15.5,18 Z" fill="white"/>
            </svg>
            <span className="text-lg font-bold text-zinc-900 hidden sm:inline">
              ItsWorthMore
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {link.label}
                </a>
              ))}
              {isAdmin && (
                <a
                  href="/admin"
                  className="relative px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  Admin
                </a>
              )}
            </nav>
            <DeviceSearch />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} onToggle={setLocale} />
            </div>

            {!isSignedIn ? (
              <a
                href="/sign-in"
                className="hidden sm:inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Sign In
              </a>
            ) : (
              <div className="hidden sm:block">
                <UserButton />
              </div>
            )}

            <Button size="sm" variant="primary" onClick={() => setDrawerOpen(true)}>
              My Box
              {itemCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-white/20 text-white text-xs font-bold px-1">
                  {itemCount}
                </span>
              )}
            </Button>

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

        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>

      <BoxDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

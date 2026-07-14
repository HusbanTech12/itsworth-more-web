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
      <header className="sticky top-0 z-40 w-full bg-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="#F0532D" />
              <path d="M 16,7 L 25,16 L 16,25 L 7,16 Z" fill="white" />
              <path d="M 16,7 L 25,16 L 16,16 Z" fill="white" opacity="0.3" />
            </svg>
            <span className="text-lg font-bold hidden sm:inline">
              <span className="text-white">Cashing</span>
              <span className="text-orange">Tech</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-lime after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {link.label}
                </a>
              ))}
              {isSignedIn && (
                <a
                  href="/dashboard/orders"
                  className="relative px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-lime after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  My Orders
                </a>
              )}
              {isAdmin && (
                <a
                  href="/admin"
                  className="relative px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-lime after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
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
                className="hidden sm:inline-flex text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </a>
            ) : (
              <div className="hidden sm:block [&_.cl-userButtonTrigger]:[&>svg]:text-white">
                <UserButton />
              </div>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-lime text-ink text-sm font-bold hover:brightness-110 transition-all uppercase tracking-wide"
            >
              Get Offer →
              {itemCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-ink/20 text-ink text-xs font-bold px-1">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden rounded-md p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Start Selling", href: "/sell" },
  { label: "Sell In Bulk", href: "/bulk-trade-in" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { isSignedIn, user } = useUser();
  const adminEmail = "husbantech08@gmail.com";
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress === adminEmail;
  const { locale, setLocale } = useLocale();

  if (!open) return null;

  return (
    <div className="lg:hidden border-t border-zinc-200 bg-white">
      <div className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Admin
          </Link>
        )}
        <div className="pt-2 border-t border-zinc-100 space-y-1">
          {isSignedIn ? (
            <Link
              href="/dashboard/orders"
              onClick={onClose}
              className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              My Orders
            </Link>
          ) : (
            <Link
              href="/sign-in"
              onClick={onClose}
              className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/sell/box"
            onClick={onClose}
            className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            My Box
          </Link>
        </div>
        <div className="pt-2">
          <LanguageSwitcher locale={locale} onToggle={setLocale} />
        </div>
      </div>
    </div>
  );
}

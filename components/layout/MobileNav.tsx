"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

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

  if (!open) return null;

  return (
    <div className="lg:hidden border-t border-white/10 bg-ink">
      <div className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="block px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="block px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            Admin
          </Link>
        )}
        <div className="pt-2 border-t border-white/10 space-y-1">
          {isSignedIn ? (
            <Link
              href="/dashboard/orders"
              onClick={onClose}
              className="block px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              My Orders
            </Link>
          ) : (
            <Link
              href="/sign-in"
              onClick={onClose}
              className="block px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/sell/box"
            onClick={onClose}
            className="block px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            My Box
          </Link>
        </div>
      </div>
    </div>
  );
}

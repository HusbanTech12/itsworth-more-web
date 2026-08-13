"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { DeviceSearch } from "@/components/shared/DeviceSearch";

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

const linkClasses =
  "block px-3 py-3 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors";

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { isSignedIn, user } = useUser();
  const adminEmails = ["husbantech08@gmail.com", "info@cashingcarz.com"];
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress && adminEmails.includes(user.primaryEmailAddress.emailAddress.toLowerCase());

  if (!open) return null;

  return (
    <div className="lg:hidden border-t border-white/10 bg-ink">
      <div className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
        <div className="pb-3">
          <DeviceSearch className="w-full" />
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className={linkClasses}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className={linkClasses}
          >
            Admin
          </Link>
        )}
        <div className="pt-2 border-t border-white/10 space-y-1">
          {isSignedIn ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonTrigger: "text-white hover:text-white/80",
                    },
                  }}
                />
                <span className="min-w-0 truncate text-sm font-medium text-white/70">
                  {user?.primaryEmailAddress?.emailAddress ?? "Account"}
                </span>
              </div>
              <Link
                href="/dashboard/orders"
                onClick={onClose}
                className={linkClasses}
              >
                My Orders
              </Link>
            </>
          ) : (
            <Link
              href="/sign-in"
              onClick={onClose}
              className={linkClasses}
            >
              Sign In
            </Link>
          )}
          <Link
            href="/sell/box"
            onClick={onClose}
            className={linkClasses}
          >
            My Box
          </Link>
        </div>
      </div>
    </div>
  );
}

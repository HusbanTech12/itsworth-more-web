import Link from "next/link";
import { Button } from "@/components/ui/Button";

const quickNav = [
  { label: "Buy Certified Pre-Owned", href: "/" },
  { label: "Get Custom Quote", href: "/custom-quote" },
  { label: "Support & FAQs", href: "/support" },
  { label: "Contact Us", href: "/support#contact-form" },
];

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Become an Affiliate", href: "/become-an-affiliate" },
  { label: "IT Asset Disposition", href: "/itad" },
  { label: "Blog", href: "/blog" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "User Agreement", href: "/user-agreement" },
  { label: "Law Enforcement", href: "/law-enforcement" },
  { label: "Accessibility", href: "/accessibility" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-white text-sm font-bold">
                I
              </div>
              <span className="text-lg font-bold text-zinc-900">ItsWorthMore</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              Smart tech. Smarter savings. Sign up for deals & sustainability tips.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button size="sm" variant="primary">Submit</Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5">
              {quickNav.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">About Us</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            &copy; 2012&ndash;2026 ItsWorthMore.com LLC &mdash; All rights reserved
          </p>
          <div className="flex items-center gap-4">
            {["youtube", "instagram", "linkedin", "x"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label={social}
              >
                <div className="h-5 w-5 rounded bg-zinc-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

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
    <footer className="bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-lg font-bold">
                <span className="text-white">ItsWorth</span>
                <span className="text-orange">More</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Smart tech. Smarter savings. Sign up for deals & sustainability tips.
            </p>
            <NewsletterForm />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5">
              {quickNav.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-lime transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">About Us</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-lime transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/50 hover:text-lime transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; 2012&ndash;2026 ItsWorthMore.com LLC &mdash; All rights reserved
          </p>
          <div className="flex items-center gap-4">
            {["youtube", "instagram", "linkedin", "x"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-white/40 hover:text-lime transition-colors"
                aria-label={social}
              >
                <div className="h-5 w-5 rounded bg-white/10" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

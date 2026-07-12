import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";

const faqItems = [
  {
    title: "How does selling my device on ItsWorthMore work?",
    content:
      "Easy. You tell us what you've got, we tell you what it's worth. If you like the offer, you ship it for free, and we send you cash. No mystery. No waiting around.",
  },
  {
    title: "What types of devices do you accept?",
    content:
      "If it's got a screen and a resale value, chances are we take it. Phones, tablets, laptops, smartwatches — you name it. Check our site to see if yours is on the list.",
  },
  {
    title: "How long is my quote valid?",
    content:
      "Your quote is locked in for 21 days. If your device arrives after that, we'll re-evaluate it based on the current market value. Prices change, so don't wait too long!",
  },
  {
    title: "Is shipping really free?",
    content:
      "Yes! We'll send you a prepaid, trackable shipping label, so you don't have to spend a dime. Just print, pack, and send. Really, it's that easy.",
  },
  {
    title: "How and when will I get paid?",
    content:
      "We pay your way — choose Check, PayPal, or Zelle when you check out. Once your device lands at our place, we'll inspect it (takes 4-7 business days), and as soon as it's approved, your cash is on the way, processed within 24-48 hours.",
  },
  {
    title: "Do I need to remove my personal data before sending?",
    content:
      "We wipe every device clean, no exceptions. But for extra peace of mind, do a factory reset before you ship it.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink">
            All the questions you wanted answered
          </h2>
          <p className="mt-3 text-ink-muted">
            And if you still have questions, just get in touch!
          </p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Accordion items={faqItems} className="bg-white rounded-2xl border border-border px-6" />
        </div>

        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button variant="outline" size="md">
            Contact Us
          </Button>
        </div>

      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-ink rounded-2xl p-8 md:p-12 border border-lime border-t-0 animate-slide-up min-h-[220px] md:min-h-[260px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Two brands.{" "}
              <span className="text-lime">One mission.</span>
              <br />
              Get you paid.
            </h2>
            <p className="mt-3 text-white/50 text-sm max-w-lg mx-auto">
              CashingTech and Cashing Carz are part of the same family — same straight-up service, different lane.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-orange text-white font-bold uppercase tracking-wide text-sm hover:brightness-110 transition-all"
              >
                <span>🚗</span> Cashing Carz <span className="font-normal normal-case ml-1">We buy your car</span>
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-lime text-ink font-bold uppercase tracking-wide text-sm hover:brightness-110 transition-all"
              >
                <span>💻</span> CashingTech <span className="font-normal normal-case ml-1">We buy your tech</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

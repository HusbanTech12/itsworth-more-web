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
    <section className="bg-zinc-50 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            All the questions you wanted answered
          </h2>
          <p className="mt-3 text-zinc-500">
            And if you still have questions, just get in touch!
          </p>
        </div>

        <Accordion items={faqItems} className="bg-white rounded-xl shadow-sm border border-zinc-200 px-6" />

        <div className="text-center mt-8">
          <Button variant="outline" size="md">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { SupportForm } from "@/components/forms/SupportForm";

export const metadata: Metadata = {
  title: "Support & FAQs | ItsWorthMore",
  description: "Find answers about selling your used electronics, shipping, payment, and more. Contact our support team for assistance.",
};

const faqItems = [
  {
    title: "How do I sell my device?",
    content:
      "Simply select your device category, brand, and model. Choose the condition that best matches your device, get an instant quote, and add it to your box. When ready, proceed to checkout, print your free shipping label, and send us your device.",
  },
  {
    title: "How long does it take to get paid?",
    content:
      "Once we receive your device, our team inspects it within 24-48 hours. If the condition matches your selection, payment is processed within 24-48 hours after inspection. Total time from delivery to payment is typically 3-5 business days.",
  },
  {
    title: "Is shipping really free?",
    content:
      "Yes, we provide a free prepaid shipping label for all orders. Simply pack your device securely, print the label, and drop it off at the carrier location. Both standard (5-7 business days) and expedited (2 business days) shipping options are available.",
  },
  {
    title: "What condition options are available?",
    content:
      "We offer five condition tiers: Brand New (factory sealed), Flawless (no scratches, like new), Good (light wear, few scratches), Fair (heavy wear, visible damage), and Broken (functionally defective). Select the option that best matches your device for the most accurate quote.",
  },
  {
    title: "What happens if my device condition differs?",
    content:
      "If our inspection finds your device is in a different condition than selected, we'll send you a revised offer. You have 3 days to accept or decline. If you decline, we return your device for free.",
  },
  {
    title: "How long are quotes valid?",
    content:
      "All quotes are valid for 21 days. If your device arrives after the quote expires, it will be re-evaluated at current market rates. We recommend shipping your device as soon as possible after accepting your quote.",
  },
  {
    title: "What payment methods do you offer?",
    content:
      "We offer Check (mailed to your address, 5-10 business days), PayPal (sent to your PayPal email, 24-48 hours), and Zelle (sent to your Zelle-registered email, usually within hours). Choose your preferred method during checkout.",
  },
  {
    title: "Can I sell multiple devices?",
    content:
      "Absolutely! You can add multiple devices to your box and sell them all in one order. For bulk quantities of 20+ devices, check out our Bulk Trade-In program for premium pricing.",
  },
  {
    title: "Do you accept devices with carrier locks?",
    content:
      "Yes, we accept devices with carrier locks. However, devices must have activation lock (iCloud/Find My) disabled. Please ensure you've signed out of all accounts and erased your device before shipping.",
  },
  {
    title: "What should I do before shipping?",
    content:
      "Back up your data, sign out of iCloud/Google account, disable Find My/activation lock, and perform a factory reset. Include any accessories (charger, box) you have — devices with accessories may receive higher offers.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Support</h1>
          <p className="mt-3 text-lg text-zinc-300">
            Find answers or reach out to our team.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={faqItems} />
          </div>

          <div className="lg:col-span-2">
            <Card padding="lg">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">
                Contact Us
              </h2>
              <SupportForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

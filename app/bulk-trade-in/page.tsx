import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BulkQuoteForm } from "@/components/forms/BulkQuoteForm";

const benefits = [
  {
    title: "Higher Offers",
    description: "Get premium pricing for bulk quantities of 20+ devices.",
  },
  {
    title: "Free Shipping",
    description: "We provide prepaid shipping labels for all bulk shipments.",
  },
  {
    title: "Fast Payment",
    description: "Receive payment within 24-48 hours of inspection.",
  },
  {
    title: "Dedicated Manager",
    description: "A dedicated relationship manager handles your account.",
  },
  {
    title: "Data Destruction",
    description: "Optional NIST-standard secure data erasure included.",
  },
  {
    title: "Flexible Payment",
    description: "Check, PayPal, Zelle, ACH Credit, or Wire transfer.",
  },
];

const faqs = [
  { q: "What is the minimum quantity for bulk?", a: "We require a minimum of 20 devices for bulk pricing." },
  { q: "How are devices evaluated?", a: "Our team inspects each device against the same condition tiers we use for retail." },
  { q: "Do you offer data destruction?", a: "Yes, we provide NIST-standard secure data erasure at no extra cost." },
  { q: "What payment methods are available?", a: "Check, PayPal, Zelle, ACH Credit, and Wire transfer." },
];

export default function BulkTradeInPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Sell Electronics in Bulk
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
            Get premium pricing on bulk quantities of 20+ devices. Free shipping,
            fast payment, and a dedicated relationship manager.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <Card key={b.title} padding="md" className="text-center">
              <h3 className="font-semibold text-zinc-900">{b.title}</h3>
              <p className="text-sm text-zinc-500 mt-2">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <Card padding="lg">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Request a Bulk Quote</h2>
          <BulkQuoteForm />
        </Card>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <Card key={faq.q} padding="md">
              <h3 className="font-semibold text-zinc-900 text-sm">{faq.q}</h3>
              <p className="text-sm text-zinc-500 mt-1">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

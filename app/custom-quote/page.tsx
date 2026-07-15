import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { CustomQuoteForm } from "@/components/forms/CustomQuoteForm";

export const metadata: Metadata = {
  title: "Get a Custom Quote | CashingTech",
  description: "Have a device not listed on our platform? Submit a custom quote request and our team will get back to you within 24 hours.",
};

const benefits = [
  {
    title: "Personalized Pricing",
    description: "Our team evaluates your specific device to give you the best possible offer — even if it's not in our standard catalog.",
  },
  {
    title: "Fast Response",
    description: "Get a custom quote within 24 hours. No automated systems, just real people reviewing your request.",
  },
  {
    title: "Bulk & Rare Devices",
    description: "Have a collection, prototype, or rare model? We specialize in unique and bulk electronics valuations.",
  },
  {
    title: "No Obligation",
    description: "Receive your quote with zero commitment. Accept, decline, or negotiate — the choice is entirely yours.",
  },
];

export default function CustomQuotePage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-cream py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-4">Custom Quote</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight text-ink">
            Don&apos;t see your device?{" "}
            <span className="text-orange">
              We&apos;ll price it
            </span>
          </h1>
          <p className="mt-4 text-lg text-ink-muted max-w-xl mx-auto">
            Tell us what you have and our team will get back to you with a tailored offer within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Why Request a Custom Quote</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
              Special devices deserve special pricing
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <Card
                key={b.title}
                padding="lg"
                className="text-center hover:shadow-lg hover:-translate-y-0.5 hover:border-orange/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-semibold text-ink">{b.title}</h3>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-3">Submit Your Request</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
              Tell us about your device
            </h2>
            <p className="mt-3 text-ink-muted">
              Fill out the form below with as much detail as possible. The more we know, the more accurate your quote.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card padding="lg" className="shadow-md border-border">
              <CustomQuoteForm />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink font-heading">
            Ready for an instant quote instead?
          </h2>
          <p className="mt-3 text-ink-muted">
            Browse our catalog for instant pricing on hundreds of devices.
          </p>
          <div className="mt-8">
            <Link
              href="/sell"
              className="inline-flex items-center px-6 py-3 rounded-md bg-orange text-white font-medium hover:brightness-110 hover:shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse devices
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
